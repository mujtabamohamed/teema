import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';
import { connectMongoDB } from "@/lib/monogodb";
import User from "@/models/user";

export async function POST(req: NextRequest){
    try {
        const body = await req.json();
        console.log("Received signup request:", body);

        const { name, email, username, password } = body;

        // Validate input
        if (!name || !email || !username || !password) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        console.log("Connecting to MongoDB...");
        await connectMongoDB();
        console.log("Connected to MongoDB successfully");

        // Check for existing email
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            console.log("Email already exists:", email);
            return NextResponse.json(
                { message: "Email already exists" },
                { status: 409 }
            );
        }

        // Check for existing username
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            console.log("Username already exists:", username);
            return NextResponse.json(
                { message: "Username already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log("Creating new user...");
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

        console.error("Registration error details:", error);

        return NextResponse.json(
            { message: "An error occured while resgistering the user" }, 
            { status: 500 });
    }
}