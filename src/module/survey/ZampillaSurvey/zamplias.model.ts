import { model, Schema } from "mongoose";
import { ITransaction } from "./zamplias.interfaces";

const TransactionSchema = new Schema<ITransaction>({
    transactionId: { type: String, required: true, unique: true },
    employeeId: { type: String, required: true },
    surveyId: { type: String, required: true },
    status: { type: String, enum: ['INITIATED', 'COMPLETE', 'TERMINATE', 'SCREENOUT'], default: 'INITIATED' },
    rewardAmount: { type: Number, default: 0 }
}, { timestamps: true });

export const Transaction = model<ITransaction>('Transaction', TransactionSchema);