import { NextResponse } from "next/server";

import { connectMongoDB } from "@/lib/monogodb"
import Team from "@/models/team";

// DELETE method to remove a user from the team
export async function DELETE(req: Request, context: { params: { teamId: string } }) {
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
                { status: 404 });
        }

        // Check if the user is not a member
        if (!team.members.includes(userId)) {
            return NextResponse.json(
                { message: "User is not a member of the team" }, 
                { status: 400 });
        }

        // Remove the user from the members array
        // Filter out the member with matching userId
        team.members = team.members.filter((memberId: any) => 
            memberId.toString() !== userId);

        // Save the updated team
        await team.save();
        // Populate the members to get updated team data
        await team.populate("members", "name _id");

        // Return success response with updated team data
        return NextResponse.json({ team }, { status: 200 });

    } catch (error) {
        console.error("Error removing member:", error);
        return NextResponse.json(
            { message: "Failed to remove member" }, 
            { status: 500 });
    }
}