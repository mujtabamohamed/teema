import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextRequest, NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb";

import Team from "@/models/team";

// Export POST handler for team creation
export async function POST(req: NextRequest) {
    // Get current user session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
        return NextResponse.json(
            { message: "Unauthorized" }, 
            { status: 401 });
    }

    try {
        // Extract team name from request body
        const { teamName } = await req.json();

        await connectMongoDB();
        
        // Create new team with name and creator as first member
        const newTeam = await Team.create({ teamName, members: [session?.user?.id] });
        // console.log("Team created:", newTeam);
        
        return NextResponse.json(
            { message: "Team created successfully" }, 
            { status: 201 });

    } catch (error) {
        console.error("Error during team creation:", error);
        return NextResponse.json(
            { message: "An error occured while creating the team" }, 
            { status: 500 });       
    }
}