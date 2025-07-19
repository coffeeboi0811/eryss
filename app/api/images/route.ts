import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const images = await prisma.image.findMany({
            orderBy: {
                createdAt: "desc",
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
        return NextResponse.json(images);
    } catch (err) {
        console.error("Failed to retrieve images:", err);
        return NextResponse.json(
            {
                error: `Failed to retrieve images`,
            },
            {
                status: 500,
            }
        );
    }
}
