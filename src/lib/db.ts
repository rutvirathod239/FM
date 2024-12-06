import mongoose from 'mongoose';

const MONGODB_URI = `mongodb+srv://root:root@cluster0.ljbrwoe.mongodb.net/flight_management?retryWrites=true&w=majority&appName=Cluster0`;

const connectToDatabase = async () => {
    
    if (mongoose?.connection?.readyState) {
        // Already connected
        return;
    }
      
    await mongoose?.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  
};

export default connectToDatabase;
