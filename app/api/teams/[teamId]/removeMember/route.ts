import { connectMongoDB } from "@/lib/monogodb"
import Team from "@/models/team";
import { NextResponse } from "next/server";

// DELETE method to remove a user from the team
export async function DELETE(req: Request, context: { params: { teamId: string } }) {
    const { teamId } = context.params;
    const { userId } = await req.json();

    try {
        await connectMongoDB();
        const team = await Team.findById(teamId);

        if (!team) {
            return NextResponse.json({ message: "Team not found" }, { status: 404 });
        }

        // Check if the user is not a member
        if (!team.members.includes(userId)) {
            return NextResponse.json({ message: "User is not a member of the team" }, { status: 400 });
        }

        // Remove the user from the members array
        team.members = team.members.filter((memberId: any) => memberId.toString() !== userId);
        await team.save();
        await team.populate("members", "name _id");

        return NextResponse.json({ team }, { status: 200 });

    } catch (error) {
        console.error("Error removing member:", error);
        return NextResponse.json({ message: "Failed to remove member" }, { status: 500 });
    }
}