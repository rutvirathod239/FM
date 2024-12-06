import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";

const SECRET_KEY: string  = process.env.JWT_SECRET || 'abcd1234';

export async function POST(req: Request) {
    const body = await req.json(); 
    const { email, password, name } = body;
    try {
        await connectToDatabase();
        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return NextResponse.json({
                status: 400,
                message: "Email is already in use"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({ email, name, password: hashedPassword, role: 'manager' });
        
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        return NextResponse.json({
            status: 200,
            message: "User registered successfully",
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                token
            },
        });
    } catch (error) {
        console.log("🚀 ~ POST ~ error:", error)
        return NextResponse.json(
            { status: 500, message: 'Internal Server Error.' }
        );
    }
    
}