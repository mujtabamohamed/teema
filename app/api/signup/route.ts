import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { connectMongoDB } from "@/lib/monogodb";
import User from "@/models/user";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();

        const { name, email, username, password } = body;
        // Validate input
        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }
        await connectMongoDB();
        console.log("Connected to MongoDB successfully");

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({ 
            name, 
            email, 
            username, 
            password: hashedPassword,
        });

        return NextResponse.json({ 
            message: "User registered successfully" },
            { status: 201 });

    } catch (error) {
        return NextResponse.json(
            { message: "An error occured while resgistering the user" }, 
            { status: 500 });
    }
}