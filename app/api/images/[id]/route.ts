import { getAuthSession } from "@/lib/authSession";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in to delete images." },
                { status: 401 }
            );
        }
        const { id } = await params;
        if (!id) {
            return NextResponse.json(
                { error: "Image ID is required." },
                { status: 400 }
            );
        }
        const image = await prisma.image.findUnique({
            where: { id },
            select: {
                id: true,
                userId: true,
            },
        });
        if (!image) {
            return NextResponse.json(
                { error: "Image not found." },
                { status: 404 }
            );
        }
        if (image.userId !== session.user.id) {
            return NextResponse.json(
                { error: "You can only delete your own images." },
                { status: 403 }
            );
        }
        await prisma.image.delete({
            where: { id },
        });
        return NextResponse.json({
            success: true,
            message: "Image deleted successfully.",
        });
    } catch (error) {
        console.error("Failed to delete image:", error);
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        );
    }
}
