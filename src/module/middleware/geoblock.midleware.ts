// import { NextFunction, Request, Response } from "express";
// import geoip from 'geoip-lite';

// const geoBlockMiddleware = (req: Request, res: Response, next: NextFunction) => {
//     let ip = 
//         (req.headers['cf-connecting-ip'] as string) || 
//         (req.headers['x-forwarded-for'] as string) || 
//         (req.headers['x-real-ip'] as string) || 
//         req.socket.remoteAddress || 
//         '';
    
//     if (ip.includes(',')) {
//         ip = ip.split(',')[0].trim();
//     }

//     if (ip.startsWith('::ffff:')) {
//         ip = ip.substring(7);
//     }

//     if (ip === '127.0.0.1' || ip === '::1') {
//         return next();
//     }

//     const geo = geoip.lookup(ip);
//     const allowedCountries = ['US', 'GB'];

//     if (geo && allowedCountries.includes(geo.country)) {
//         next();
//     } else {
//         res.status(403).json({
//             success: false,
//             message: 'You are not eligible for this country.'
//         });
//     }
// };

// export default geoBlockMiddleware;