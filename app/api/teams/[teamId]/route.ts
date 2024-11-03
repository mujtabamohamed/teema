// app/teams/[teamId]/route.ts
import { connectMongoDB } from "@/lib/monogodb"
import Team from "@/models/team";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest, context: { params: { teamId: string } }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json(
            { message: "Authentication required" },
            { status: 401 }
        );
    }
    
    const params = await context.params;
    const teamId = params.teamId;
    const userId = session.user.id;

    try {
        await connectMongoDB();

        const { teamId } = await Promise.resolve(context.params);
        if (!teamId) {
            return NextResponse.json(
                { 
                    message: "Team ID not provided" 
                }, { status: 400 });
        }

        const team = await Team.findById(teamId).populate("members", "name _id email username");

        if (!team) {
            return NextResponse.json(
                {
                    message: "Team not found" 
                }, { status: 404 });
        }

        const isMember = team.members.some(
            (member: any) => member._id.toString() === userId);
        
        if (!isMember) {
            return NextResponse.json(
                { 
                    message: "You do not have permission to view this team" 
                }, { status: 403 });
        }
        return NextResponse.json(
            { 
                team 
            }, { status: 200 });

    } catch (error) {
        console.error("Error fetching team:", error);
        return NextResponse.json(
            { 
                message: "Failed to fetch team details" 
            }, { status: 500 });
    }
}