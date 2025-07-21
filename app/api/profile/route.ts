import { getAuthSession } from "@/lib/authSession";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validators/profile";

export async function PUT(request: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                {
                    error: "Unauthorized. Please sign in to update your profile.",
                },
                { status: 401 }
            );
        }
        const body = await request.json();
        const validationResult = updateProfileSchema.safeParse(body);
        if (!validationResult.success) {
            return NextResponse.json(
                {
                    error: "Invalid input data",
                    details: validationResult.error.issues.map((issue) => ({
                        field: issue.path.join("."),
                        message: issue.message,
                    })),
                },
                { status: 400 }
            );
        }
        const { name, bio } = validationResult.data;
        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                name: name,
                bio: bio || null,
            },
            select: {
                id: true,
                name: true,
                image: true,
                bio: true,
            },
        });
        return NextResponse.json({
            success: true,
            message: "Profile updated successfully",
        });
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json(
            { error: "Failed to update profile" },
            { status: 500 }
        );
    }
}
