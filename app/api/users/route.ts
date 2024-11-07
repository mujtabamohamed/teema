import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb"
import User from "@/models/user";

// Export GET handler for fetching all users
export async function GET() {
    try {
        await connectMongoDB();
        
        // Find all users but only return name, _id, and username fields
        // {} means no filter - get all users
        // "name _id username" specifies fields to return

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
