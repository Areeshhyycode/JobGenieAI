import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String },
  password: { type: String },
  provider: { type: String, enum: ['google', 'github', 'credentials'], required: true },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
