import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable in .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      family: 4, // Force IPv4 — fixes DNS SRV timeout on some networks
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('MongoDB Connected Successfully');
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    console.error('MongoDB Connection Error:', error.message);
    throw error;
  }
}

mongoose.connection.on('error', (err) => {
  console.error('Mongo Error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB Disconnected');
});

export default connectDB;
