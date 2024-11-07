import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb"
import Team from "@/models/team";

// Export POST handler for adding team member
// context.params contains route parameters (teamId)
export async function POST(req: Request, context: { params: { teamId: string } }) {
    // Extract teamId from route parameters
    const { teamId } = context.params;  
    // Extract userId from request body
    const { userId } = await req.json(); 

    try {
        await connectMongoDB();

        // Find team by ID
        const team = await Team.findById(teamId); 

        // Check if team exists
        if (!team) {
            return NextResponse.json(
                { message: "Team not found" },
                { status: 404 }
            );
        }

        // Check if the user is already a member
        if (team.members.includes(userId)) {
            return NextResponse.json(
                { message: "User is already a team member" },
                { status: 400 }
            );
        }

        // Add the user to the team's members
        team.members.push(userId);
        // Save the updated team
        await team.save();

        // Populate the members to get updated team data
        await team.populate("members", "name _id"); 
        // Return success response with updated team data
        return NextResponse.json(
            { team }, 
            { status: 200 });

    } catch (error) {
        console.error("Error adding member:", error);
        return NextResponse.json(
            { message: "Failed to add member" },
            { status: 500 }
        );
    }
}
