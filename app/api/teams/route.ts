import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb";
import Team from "@/models/team";

export async function GET() {
    try {
        await connectMongoDB();

        // Find all teams and populate member names
        // .find() - gets all teams
        // .populate('members', 'name') - replaces member IDs with actual member names

        const teams = await Team.find().populate('members', 'name');
        
        // Return success response with teams data and 200 OK status
        return NextResponse.json(
            { teams },      // Array of team objects
            { status: 200 });
        
    } catch (error) {
        console.error("Error retrieving teams:", error);
        return NextResponse.json(
            { message: "An error occurred while fetching teams" }, 
            { status: 500 });
    }
}
