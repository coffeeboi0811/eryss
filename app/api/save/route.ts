import { getAuthSession } from "@/lib/authSession";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in to save images." },
                { status: 401 }
            );
        }
        const { imageId } = await request.json();
        if (!imageId) {
            return NextResponse.json(
                { error: "Image ID is required." },
                { status: 400 }
            );
        }
        const image = await prisma.image.findUnique({
            where: { id: imageId },
        });
        if (!image) {
            return NextResponse.json(
                { error: "Image not found." },
                { status: 404 }
            );
        }
        const alreadySaved = await prisma.save.findUnique({
            where: {
                userId_imageId: {
                    userId: session.user.id,
                    imageId: image.id,
                },
            },
        });
        if (alreadySaved) {
            await prisma.save.delete({
                where: {
                    userId_imageId: {
                        userId: session.user.id,
                        imageId: image.id,
                    },
                },
            });
            return NextResponse.json({
                saved: false,
            });
        } else {
            await prisma.save.create({
                data: {
                    userId: session.user.id,
                    imageId: image.id,
                },
            });
            return NextResponse.json({
                saved: true,
            });
        }
    } catch (error) {
        console.error("Failed to save image:", error);
        return NextResponse.json(
            { error: "Failed to save image" },
            { status: 500 }
        );
    }
}
