const axios = require('axios');
const crypto = require('crypto');
const { Survey, Transaction } = require('./models');

const ZAMP_KEY = process.env.ZAMP_STAGING_KEY;
const EXIT_HMAC_KEY = process.env.ZAMP_EXIT_HMAC_KEY;
const BASE_URL = 'https://surveysupplysandbox.zamplia.com/api/v1';

const syncSurveys = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/Surveys/GetAllocatedSurveys`, {
      headers: { 'Accept': 'application/json', 'ZAMP-KEY': ZAMP_KEY }
    });
    const surveys = response.data.result || [];
    for (let s of surveys) {
      await Survey.findOneAndUpdate(
        { surveyId: s.SurveyId },
        { cpi: s.CPI, loi: s.LOI, isActive: true },
        { upsert: true }
      );
    }
    const liveSurveys = await Survey.find({ isActive: true });
    res.json({ success: true, surveys: liveSurveys });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const startSurvey = async (req, res) => {
  try {
    const { surveyId, employeeId } = req.body;
    const transactionId = crypto.randomBytes(16).toString('hex');
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';
    
    const response = await axios.get(`${BASE_URL}/Surveys/GenerateLink`, {
      headers: { 'Accept': 'application/json', 'ZAMP-KEY': ZAMP_KEY },
      params: { SurveyId: surveyId, IpAddress: ipAddress, TransactionId: transactionId }
    });

    await Transaction.create({ transactionId, employeeId, surveyId });
    res.json({ success: true, entryLink: response.data.result.Link || response.data.result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const handleExitCallback = async (req, res) => {
  try {
    const { transactionId, status, secure } = req.query;
    const message = `transactionId=${transactionId}&status=${status}`;
    const generatedHash = crypto.createHmac('sha256', EXIT_HMAC_KEY).update(message).digest('hex');

    if (generatedHash !== secure) {
      return res.status(403).send('Invalid Secure Hash');
    }

    const tx = await Transaction.findOne({ transactionId });
    if (!tx) {
      return res.status(404).send('Transaction Not Found');
    }

    tx.status = status.toUpperCase();
    if (tx.status === 'COMPLETE') {
      const survey = await Survey.findOne({ surveyId: tx.surveyId });
      tx.rewardAmount = survey ? survey.cpi * 0.7 : 0;
    }
    await tx.save();

    res.send('Callback Processed Successfully');
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { syncSurveys, startSurvey, handleExitCallback };