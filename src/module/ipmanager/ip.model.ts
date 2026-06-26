import mongoose, { Model, Schema } from "mongoose";
import { IIPManager } from "./ipmanager.interfaces";

const ipmodel: Schema = new Schema({
    connectionType: { type: String, enum: ['vps', 'proxy'], required: true },
    incomingIP: { type: String, required: true, unique: true },
    proxyHost: { type: String, default: null },
    proxyPort: { type: String, default: null },
    proxyUsername: { type: String, default: null },
    proxyPassword: { type: String, default: null },
    country: { type: String, enum: ['US', 'UK'], required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: { type: String, enum: ['active', 'dead'], default: 'active' }
}, { timestamps: true });

export const ipModel : Model<IIPManager> = mongoose.model<IIPManager>('IPManager', ipmodel);