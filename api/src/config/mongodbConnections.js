import mongoose from 'mongoose';

export default async () => {
  const MONGODB_URI = process.env.MONGODB_URI;
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Database Successfull');
  } catch (error) {
    throw error;
  }
}