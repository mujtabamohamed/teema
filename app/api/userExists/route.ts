import { connectMongoDB } from "@/lib/monogodb";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try { 
        await connectMongoDB();
        const { email, username } = await req.json();
        const user = await User.findOne({ $or: [{ email }, { username }] }).select("_id username");
        console.log("User: ", user);
        return NextResponse.json({ user });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ 
            message: "An error occurred while processing your request." 
        }, { status: 500 });
    }
}