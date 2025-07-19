import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const image = await prisma.image.findUnique({
            where: {
                id: id,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    },
                },
            },
        });
        if (!image) {
            return NextResponse.json(
                { error: `Image with ID ${id} not found` },
                { status: 404 }
            );
        }
        return NextResponse.json(image);
    } catch (error) {
        console.error("Failed to retrieve image:", error);
        return NextResponse.json(
            {
                error: `Failed to retrieve image with ID ${id}`,
            },
            {
                status: 500,
            }
        );
    }
}
