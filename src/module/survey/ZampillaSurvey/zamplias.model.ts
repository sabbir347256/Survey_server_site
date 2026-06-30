const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  surveyId: { type: String, required: true, unique: true },
  name: { type: String, default: 'Zamplia Survey' },
  cpi: { type: Number, required: true },
  loi: { type: Number, default: 10 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  employeeId: { type: String, required: true },
  surveyId: { type: String, required: true },
  status: { type: String, enum: ['INITIATED', 'COMPLETE', 'TERMINATE', 'SCREENOUT'], default: 'INITIATED' },
  rewardAmount: { type: Number, default: 0 }
}, { timestamps: true });

const Survey = mongoose.model('Survey', SurveySchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

module.exports = { Survey, Transaction };