import { Request, Response } from "express";
import { ipModel } from "./ip.model";

const addIP = async (req: Request, res: Response) => {
    try {
        const { connectionType, incomingIP, proxyHost, proxyPort, proxyUsername, proxyPassword, country } = req.body;

        const ipExists = await ipModel.findOne({ incomingIP });
        if (ipExists) {
            res.status(400).json({ message: "IP already exists in pool" });
            return;
        }

        const newIP = new ipModel({
            connectionType,
            incomingIP,
            proxyHost: connectionType === 'proxy' ? proxyHost : null,
            proxyPort: connectionType === 'proxy' ? proxyPort : null,
            proxyUsername: connectionType === 'proxy' ? proxyUsername : null,
            proxyPassword: connectionType === 'proxy' ? proxyPassword : null,
            country
        });

        await newIP.save();
        res.status(201).json({ success: true, message: "IP added to pool successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

 const getAllIPs = async (req: Request, res: Response) => {
    try {
        const ips = await ipModel.find().populate('assignedTo', 'name email');
        res.status(200).json({ success: true, data: ips });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

 const updateIPStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedIP = await ipModel.findByIdAndUpdate(id, { status }, { new: true });
        if (!updatedIP) {
            res.status(404).json({ message: "IP not found" });
            return;
        }

        res.status(200).json({ success: true, message: "IP status updated", data: updatedIP });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

 const deleteIP = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedIP = await ipModel.findByIdAndDelete(id);

        if (!deletedIP) {
            res.status(404).json({ message: "IP not found" });
            return;
        }

        res.status(200).json({ success: true, message: "IP removed from pool successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const ipManagerController = {
    addIP,
    getAllIPs,
    updateIPStatus,
    deleteIP
};  