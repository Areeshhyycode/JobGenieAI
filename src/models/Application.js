import mongoose from 'mongoose';

const ApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  jobUrl: { type: String },
  jobDescription: { type: String },
  salary: { type: String },
  location: { type: String },
  status: {
    type: String,
    enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
    default: 'Applied',
  },
  notes: { type: String },
  appliedDate: { type: Date, default: Date.now },
}, {
  timestamps: true,
});

export default mongoose.models.Application || mongoose.model('Application', ApplicationSchema);
