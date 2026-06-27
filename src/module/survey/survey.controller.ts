import { Request, Response } from "express";
import envVars from "../../config/envars";

const getAllSurveys = async (req: Request, res: Response) => {
    try {
        const user = req.user as { _id: string };
        const userId = user._id;

        const surveyProviders = [
            {
                id: "lootwalls",
                name: "Lootwalls",
                description: "Share your opinions on simple topics and instantly stack points.",
                url: `https://www.lootwalls.com/wall?apiKey=${envVars?.PROVIDER_LOOTWALLS_KEY}&userId=${userId}`
            },
            {
                id: "offertoro",
                name: "OfferToro",
                description: "Complete high-paying surveys and unlock premium wallet rewards.",
                url: `https://www.offertoro.com/wall?secret=${process.env.PROVIDER_OFFERTORO_KEY}&user_id=${userId}`
            },
            {
                id: "cpalead",
                name: "CPALead",
                description: "Quick surveys with fast approval. Earn points directly into your wallet.",
                url: `https://www.cpalead.com/wall?pub=${process.env.PROVIDER_CPALEAD_KEY}&subid=${userId}`
            }
        ];

        res.status(200).json({
            success: true,
            providers: surveyProviders
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

export const surveyController = {
    getAllSurveys
};