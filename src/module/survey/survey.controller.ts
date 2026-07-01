import { Request, Response } from "express";
import envVars from "../../config/envars";
import { userModel } from "../user/user.model";

const getAllSurveys = async (req: Request, res: Response) => {
    try {
        const user = req.user as { userID: string };
        const userId = user.userID;

        const surveyProviders = [
            {
                id: "lootwalls",
                name: "Lootwalls",
                description: "Share your opinions on simple topics and instantly stack points.",
                url: `https://www.lootwalls.com/wall?apiKey=${envVars?.PROVIDER_LOOTWALLS_KEY}&userId=${userId}`
            }
        ];

        return res.status(200).json({
            success: true,
            providers: surveyProviders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

const handleLootwallsCallback = async (req: Request, res: Response) => {
    try {
        const { uid, amount } = req.body;
        console.log(uid)
        console.log(amount)



        if (!uid || !amount ) {
            return res.status(400).json({
                success: false,
                message: "Bad Request: Missing parameters"
            });
        }

        if (!envVars?.LOOTWALLS_API_SECRET) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid Secret Key"
            });
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            uid,
            { $inc: { balance: Number(amount) } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).send("1");

    } catch (error) {
        return res.status(500).send("Error");
    }
};

// const handleLootwallsCallback = async (req: Request, res: Response) => {
//     try {
//         const { userId, amount } = req.query;

//         console.log("Lootwalls Callback received! Query Data:", req.query);

//         if (!userId || !amount) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Bad Request"
//             });
//         }

//         const updatedUser = await userModel.findByIdAndUpdate(
//             userId,
//             { $inc: { balance: Number(amount) } },
//             { new: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ success: false, message: "User not found" });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Success"
//         });

//     } catch (error) {
//         return res.status(500).json({ success: false, message: "Error" });
//     }
// };

export const surveyController = {
    getAllSurveys,
    handleLootwallsCallback
};