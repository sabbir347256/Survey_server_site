import { Request, Response } from 'express';
import { IZampliaResponse } from './zamplias.interfaces';
import { Transaction } from './zamplias.model';
import axios from 'axios';
import crypto from 'crypto';
import envVars from '../../../config/envars';

const ZAMP_KEY = envVars.ZAMP_STAGING_KEY as string;
const EXIT_HMAC_KEY = envVars.ZAMP_EXIT_HMAC_KEY as string;
// const BASE_URL = 'https://zamplia.zamplia.com/api/v1';
const BASE_URL = ' https://surveysupplysandbox.zamplia.com/api/v1';

export const syncSurveys = async (req: Request, res: Response) => {
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

        if (resultData) {
            link = resultData?.data[0]?.LiveLink
        }

        if (!link || typeof link !== 'string' || !link.startsWith('http')) {
            res.status(400).json({
                success: false,
                error: 'Invalid or missing entry link from Zamplia API'
            });
            return;
        }

        await Transaction.create({ transactionId, employeeId, surveyId });

        res.json({ success: true, entryLink: link });
    } catch (error: any) {
        res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
    }
};

// export const handleExitCallback = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const { transactionId, status, secure } = req.query as { transactionId: string; status: string; secure: string };
//         const message = `transactionId=${transactionId}&status=${status}`;
//         const generatedHash = crypto.createHmac('sha256', EXIT_HMAC_KEY).update(message).digest('hex');

//         if (generatedHash !== secure) {
//             return res.status(403).send('Invalid Secure Hash');
//         }

//         const tx = await Transaction.findOne({ transactionId });
//         if (!tx) {
//             return res.status(404).send('Transaction Not Found');
//         }

//         tx.status = status.toUpperCase() as any;
//         if (tx.status === 'COMPLETE') {
//             const survey = await Survey.findOne({ surveyId: tx.surveyId });
//             tx.rewardAmount = survey ? survey.cpi * 0.7 : 0;
//         }
//         await tx.save();

//         res.send('Callback Processed Successfully');
//     } catch (error: any) {
//         res.status(500).send('Internal Server Error');
//     }
// };