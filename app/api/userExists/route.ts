import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb";
import User from "@/models/user";

// Export POST handler to check if user exists
export async function POST(req: NextRequest) {
    try { 
        await connectMongoDB();

        // Extract email and username from request body
        const { email, username } = await req.json();
        
        // Find user by email or username
        // $or operator allows checking multiple conditions
        const user = await User.findOne(
            { $or: [
                { email }, 
                { username }
            ] }).select("_id username");

        return NextResponse.json({ user });

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "An error occurred while processing your request." }, 
            { status: 500 });
    }
}