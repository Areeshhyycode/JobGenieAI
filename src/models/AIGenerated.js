import mongoose from 'mongoose';

const AIGeneratedSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true, index: true },
  coverLetter: { type: String },
  interviewQuestions: { type: String },
  followUpEmail: { type: String },
  matchScore: { type: Number },
  resumeTips: { type: String },
}, {
  timestamps: true,
});

export default mongoose.models.AIGenerated || mongoose.model('AIGenerated', AIGeneratedSchema);
