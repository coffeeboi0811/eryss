import { ImageDetailPageWrapper } from "@/components/ImageDetailPageWrapper";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/authSession";
import { shuffleArray } from "@/lib/shuffleArray";

interface ImageDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ImageDetailPage({
    params,
}: ImageDetailPageProps) {
    const { id } = await params;
    const session = await getAuthSession();

    // fetch the main image
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

    // check if current user has liked this image
    let isLiked = false;
    if (session?.user?.id) {
        const likeRecord = await prisma.like.findUnique({
            where: {
                userId_imageId: {
                    userId: session.user.id,
                    imageId: image.id,
                },
            },
        });
        isLiked = !!likeRecord;
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

    const shuffledRelatedImages = shuffleArray(relatedImages);

    return (
        <ImageDetailPageWrapper
            imageId={image.id}
            imageData={{
                imageSrc: image.imageUrl,
                authorImg: image.user?.image || undefined,
                authorName: image.user?.name || undefined,
                title: image.title,
                description: image.description || undefined,
                createdAt: image.createdAt,
            }}
            relatedImages={shuffledRelatedImages.map((img) => ({
                id: img.id,
                imageSrc: img.imageUrl,
                authorImg: img.user?.image || undefined,
                authorName: img.user?.name || undefined,
            }))}
            initialLiked={isLiked}
        />
    );
}
