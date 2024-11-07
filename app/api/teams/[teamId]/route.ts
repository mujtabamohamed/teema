import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { connectMongoDB } from "@/lib/monogodb";
import Team from "@/models/team";

// Export GET handler for fetching specific team details
// context.params contains route parameters (teamId)
export async function GET(req: NextRequest, context: { params: { teamId: string } }) {
    
    // Get user session
    const session = await getServerSession(authOptions);

    // Check if user is authenticated
    if (!session) {
        return NextResponse.json(
            { message: "Authentication required" },
            { status: 401 }
        );
    }

    // Extract user ID from session
    const userId = session.user.id;

    try {
        await connectMongoDB();
        const { teamId } = await Promise.resolve(context.params);

        if (!teamId) {
            return NextResponse.json(
                { message: "Team ID not provided" }, 
                { status: 400 });
        }

        // Find team by ID and populate member details
        // Includes name, _id, email, and username of each member
        const team = await Team.findById(teamId).populate(
            "members", 
            "name _id email username"
        );

        // Check if team exists
        if (!team) {
            return NextResponse.json(
                { message: "Team not found" }, 
                { status: 404 });
        }

        // Check if current user is a member of the team
        const isMember = team.members.some(
            (member: any) => member._id.toString() === userId);
        
         // If user is not a team member, deny access
        if (!isMember) {
            return NextResponse.json(
                { message: "You do not have permission to view this team" }, 
                { status: 403 });
        }

        // Return success response with team data
        return NextResponse.json(
            { team }, 
            { status: 200 });

    } catch (error) {
        console.error("Error fetching team:", error);
        return NextResponse.json(
            { message: "Failed to fetch team details" }, 
            { status: 500 });
    }
}