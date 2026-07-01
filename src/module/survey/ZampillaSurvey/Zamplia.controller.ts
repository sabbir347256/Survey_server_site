import { Request, Response } from 'express';
import { Transaction } from './zamplias.model';
import axios from 'axios';
import crypto from 'crypto';
import envVars from '../../../config/envars';

const ZAMP_KEY = envVars.ZAMP_STAGING_KEY as string;
const EXIT_HMAC_KEY = envVars.ZAMP_EXIT_HMAC_KEY as string;
const BASE_URL = 'https://surveysupplysandbox.zamplia.com/api/v1';

export const syncSurveys = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization;
        const response = await axios.get(`${BASE_URL}/Surveys/GetAllocatedSurveys`, {
            headers: {
                'Accept': 'application/json',
                'ZAMP-KEY': ZAMP_KEY,
                'Authorization': token
            }
        });
        const surveys = response.data.result || [];
        res.json({ success: true, surveys });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const startSurvey = async (req: Request, res: Response): Promise<void> => {
    try {
        const { surveyId, employeeId } = req.body;
        const transactionId = crypto.randomBytes(16).toString('hex');
        const ipAddress = (req as any).ipAddress || '127.0.0.1';

        const response = await axios.get(`${BASE_URL}/Surveys/GenerateLink`, {
            headers: {
                'Accept': 'application/json',
                'ZAMP-KEY': ZAMP_KEY
            },
            params: {
                SurveyId: surveyId,
                IpAddress: ipAddress,
                TransactionId: transactionId
            }
        });

        const resultData = response.data.result;
        let link = '';

        if (resultData && resultData.data && resultData.data[0]) {
            link = resultData.data[0].LiveLink || '';
        }

        if (!link || typeof link !== 'string' || !link.startsWith('http')) {
            res.status(400).json({
                success: false,
                error: 'Invalid or missing entry link from Zamplia API'
            });
            return;
        }

        if (!link.includes('transactionId')) {
            link = `${link}&transactionId=${transactionId}`;
        }

        await Transaction.create({ transactionId, employeeId, surveyId });

        res.json({ success: true, entryLink: link });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
    }
};

export const handleExitCallback = async (req: Request, res: Response): Promise<void> => {
    try {
        const { transactionId, status } = req.query as { transactionId: string; status: string };

        const tx = await Transaction.findOne({ transactionId });
        if (!tx) {
            res.redirect('https://survey.webearners.app/dashboard?error=not_found');
            return;
        }

        tx.status = status.toUpperCase() as any;
        await tx.save();

        res.redirect(`https://survey.webearners.app/dashboard?status=${status}`);
    } catch (error: any) {
        res.redirect('https://survey.webearners.app/dashboard?error=server_error');
    }
};