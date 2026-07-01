import { NextFunction, Request, Response } from "express";
import geoip from 'geoip-lite';

const geoBlockMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let ip = 
        (req.headers['cf-connecting-ip'] as string) || 
        (req.headers['x-forwarded-for'] as string) || 
        (req.headers['x-real-ip'] as string) || 
        req.socket.remoteAddress || 
        '';
    
    if (ip.includes(',')) {
        ip = ip.split(',')[0].trim();
    }

    if (ip.startsWith('::ffff:')) {
        ip = ip.substring(7);
    }

    console.log(`[GeoBlock] Incoming IP: ${ip}`);

    (req as any).ipAddress = ip;

    if (ip === '127.0.0.1' || ip === '::1') {
        console.log("[GeoBlock] Allowed because it is Localhost");
        (req as any).ipAddress = '104.244.42.1'; 
        return next();
    }

    const geo = geoip.lookup(ip);
    console.log(`[GeoBlock] Geo Lookup Result:`, geo);

    const allowedCountries = ['US', 'GB'];

    if (geo && allowedCountries.includes(geo.country)) {
        console.log(`[GeoBlock] Access GRANTED for country: ${geo.country}`);
        next();
    } else {
        console.log(`[GeoBlock] Access DENIED for country: ${geo?.country || 'Unknown'}`);
        return res.status(403).json({
            success: false,
            message: 'You are not eligible from this country.'
        });
    }
};

export default geoBlockMiddleware;