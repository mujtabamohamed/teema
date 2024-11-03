import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb"
import Team from "@/models/team";

export async function POST(req: Request, context: { params: { teamId: string } }) {
    const { teamId } = context.params;  
    const { userId } = await req.json(); 

    try {
        await connectMongoDB();

        const team = await Team.findById(teamId); 

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
        await team.save();

        // Populate the members to get updated team data
        await team.populate("members", "name _id"); 
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
