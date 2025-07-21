import { getAuthSession } from "@/lib/authSession";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in to follow users." },
                { status: 401 }
            );
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "User ID is required." },
                { status: 400 }
            );
        }
        const userToFollow = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                name: true,
                image: true,
            },
        });
        if (!userToFollow) {
            return NextResponse.json(
                { error: "User not found." },
                { status: 404 }
            );
        }
        const existingFollow = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: userToFollow.id,
                },
            },
        });
        if (existingFollow) {
            await prisma.follow.delete({
                where: {
                    followerId_followingId: {
                        followerId: session.user.id,
                        followingId: userToFollow.id,
                    },
                },
            });
            return NextResponse.json({
                followed: false,
                message: "Unfollowed successfully.",
            });
        } else {
            await prisma.follow.create({
                data: {
                    followerId: session.user.id,
                    followingId: userToFollow.id,
                },
            });
            return NextResponse.json({
                followed: true,
                message: "Followed successfully.",
            });
        }
    } catch (error) {
        console.error("Failed to follow user:", error);
        return NextResponse.json(
            { error: "Failed to follow user" },
            { status: 500 }
        );
    }
}
