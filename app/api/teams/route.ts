// /api/teams/route.ts

import { connectMongoDB } from "@/lib/monogodb";
import Team from "@/models/team";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await connectMongoDB();
        
        const teams = await Team.find().populate('members', 'name');

        return NextResponse.json({ teams }, { status: 200 });
    } catch (error) {
        console.error("Error retrieving teams:", error);
        return NextResponse.json(
            { 
                message: "An error occurred while fetching teams" 
            }, { status: 500 });
    }
}
