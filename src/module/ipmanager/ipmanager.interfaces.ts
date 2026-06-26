import { Types } from "mongoose";

export enum ConnectionType {
    VPS = "VPS",
    PROXY = "PROXY",
}

export interface IIPManager extends Document {
    connectionType: ConnectionType;
    incomingIP: string;
    proxyHost: string | null;
    proxyPort: string | null;
    proxyUsername: string | null;
    proxyPassword: string | null;
    country: 'US' | 'UK';
    assignedTo: Types.ObjectId | null;
    status: 'active' | 'dead';
    createdAt: Date;
    updatedAt: Date;
}