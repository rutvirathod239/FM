import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from './models/userModel';
import connectToDatabase from "./lib/db";

const seedDB = async () => {
    mongoose.set('strictQuery', false);
    await connectToDatabase();
    const existingAdmin = await UserModel.findOne({ role: "admin" });
    if (!existingAdmin) {
        const adminCreds = {
            name: 'Admin',
            email: 'admin@example.com',
            password: 'adminPass',
            role: 'admin'
        }
        const hashedPassword = await bcrypt.hash(adminCreds.password, 10);
        adminCreds.password = hashedPassword
        await UserModel.create(adminCreds);
        await mongoose.disconnect();
    }    
};

seedDB().then(() => {
    console.log("Admin seeding completed");
    process.exit(0);
}).catch((err) => {
    console.error("Error seeding admin:", err);
    process.exit(1);
});