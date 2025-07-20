import { ImageDetailPageWrapper } from "@/components/ImageDetailPageWrapper";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

interface ImageDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ImageDetailPage({
    params,
}: ImageDetailPageProps) {
    const { id } = await params;

    // the main image
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
        notFound();
    }

    // related images (excluding current image)
    const relatedImages = await prisma.image.findMany({
        where: {
            id: {
                not: id,
            },
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
        take: 20, // limit to 20 related images
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <ImageDetailPageWrapper
            imageData={{
                imageSrc: image.imageUrl,
                authorImg: image.user?.image || undefined,
                authorName: image.user?.name || undefined,
                title: image.title,
                description: image.description || undefined,
                createdAt: image.createdAt,
            }}
            relatedImages={relatedImages.map((img) => ({
                id: img.id,
                imageSrc: img.imageUrl,
                authorImg: img.user?.image || undefined,
                authorName: img.user?.name || undefined,
            }))}
        />
    );
}
