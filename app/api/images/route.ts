import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/authSession";
import prisma from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { createImageSchema } from "@/lib/validators/image";

export async function POST(request: NextRequest) {
    try {
        const session = await getAuthSession();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized. Please sign in to upload images." },
                { status: 401 }
            );
        }
        const body = await request.json();
        const validationResult = createImageSchema.safeParse(body);
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
        const { title, description, imageBase64 } = validationResult.data;
        // upload image to cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(
            imageBase64,
            {
                folder: "eryss/images",
                transformation: [
                    { quality: "auto:good" },
                    { fetch_format: "auto" },
                ],
                resource_type: "image",
            }
        );
        const image = await prisma.image.create({
            data: {
                title,
                description: description || null,
                imageUrl: cloudinaryResponse.secure_url,
                userId: session.user.id,
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
        return NextResponse.json(
            {
                message: "Image uploaded successfully",
                image,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Failed to create image:", error);
        return NextResponse.json(
            { error: "Failed to create image" },
            { status: 500 }
        );
    }
}
