import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb"
import User from "@/models/user";

export async function GET() {
    try {
        await connectMongoDB();
        const users = await User.find(
            {}, "name _id username");

        return NextResponse.json(
            { users }, 
            { status: 200 });
            
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: "Failed to fetch users" },
            { status: 500 }
        );
    }
}
