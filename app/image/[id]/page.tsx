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
                    _count: {
                        select: {
                            followers: true,
                        },
                    },
                },
            },
            _count: {
                select: {
                    likes: true,
                },
            },
        },
    });

    if (!image) {
        notFound();
    }

    // check if current user has liked and saved this image
    let isLiked = false;
    let isSaved = false;
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

        const saveRecord = await prisma.save.findUnique({
            where: {
                userId_imageId: {
                    userId: session.user.id,
                    imageId: image.id,
                },
            },
        });

        isSaved = !!saveRecord;
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
            _count: {
                select: {
                    likes: true,
                },
            },
        },
        take: 20, // limit to 20 related images
        orderBy: {
            createdAt: "desc",
        },
    });

    const shuffledRelatedImages = shuffleArray(relatedImages);

    let relatedImageLikes: string[] = [];
    let relatedImageSaves: string[] = [];
    if (session?.user?.id) {
        const relatedImageIds = shuffledRelatedImages.map((img) => img.id);
        const likes = await prisma.like.findMany({
            where: {
                userId: session.user.id,
                imageId: {
                    in: relatedImageIds,
                },
            },
            select: {
                imageId: true,
            },
        });
        relatedImageLikes = likes.map((like) => like.imageId);

        const saves = await prisma.save.findMany({
            where: {
                userId: session.user.id,
                imageId: {
                    in: relatedImageIds,
                },
            },
            select: {
                imageId: true,
            },
        });
        relatedImageSaves = saves.map((save) => save.imageId);
    }

    return (
        <ImageDetailPageWrapper
            imageId={image.id}
            imageData={{
                imageSrc: image.imageUrl,
                authorImg: image.user?.image || undefined,
                authorName: image.user?.name || undefined,
                authorId: image.user?.id,
                title: image.title,
                description: image.description || undefined,
                createdAt: image.createdAt,
                likesCount: image._count.likes,
                followersCount: image.user?._count?.followers,
            }}
            relatedImages={shuffledRelatedImages.map((img) => ({
                id: img.id,
                imageSrc: img.imageUrl,
                authorImg: img.user?.image || undefined,
                authorName: img.user?.name || undefined,
                authorId: img.user?.id,
                initialLiked: relatedImageLikes.includes(img.id),
                initialSaved: relatedImageSaves.includes(img.id),
                likesCount: img._count.likes,
            }))}
            initialLiked={isLiked}
            initialSaved={isSaved}
        />
    );
}
