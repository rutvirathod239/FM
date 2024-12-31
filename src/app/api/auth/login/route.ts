import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import UserModel from "@/models/userModel";
import { NextResponse } from "next/server";

const SECRET_KEY: string  = process.env.JWT_SECRET || 'abcd1234';

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;

    try {
        await connectToDatabase();

        const user = await UserModel.findOne({ email });

        if (!user) {
            return NextResponse.json({
                status: 404,
                message: "User not found",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json({
                status: 401,
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            SECRET_KEY,
            { expiresIn: "1h" }
        );
        return NextResponse.json({
            status: 200,
            message: "Login successful",
            user: {
                email: user.email,
                name: user.name,
                role: user.role,
                token
            },
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            return NextResponse.json(
                { status: 500, message: "Internal server error" }
            );
        }
    }
}
