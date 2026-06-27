// import { NextFunction, Request, Response } from "express";
// import { ipModel } from "../ipmanager/ip.model";

// export const verifyPoolAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const ipHeader = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
//         const rawIP = Array.isArray(ipHeader) ? ipHeader[0] : ipHeader;

        
//         const clientIP = rawIP.split(',')[0].trim();

//         if (!clientIP) {
//             res.status(400).json({
//                 success: false,
//                 message: "Security Alert: Unable to determine client IP address."
//             });
//             return;
//         }

//         const isApprovedIP = await ipModel.findOne({ incomingIP: clientIP, status: 'active' });

//         if (!isApprovedIP) {
//             res.status(403).json({
//                 success: false,
//                 message: "Security Alert: You are not connected from an authorized VPS or Proxy!"
//             });
//             return;
//         }

//         next();
//     } catch (error) {
//         res.status(500).json({ error: "IP verification failed" });
//     }
// };

