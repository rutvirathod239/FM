import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!

const connectToDatabase = async () => {
    
    if (mongoose?.connection?.readyState) {
        return;
    }
      
    await mongoose?.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  
};

export default connectToDatabase;
