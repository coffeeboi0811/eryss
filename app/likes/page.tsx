import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { requireAuth } from "@/lib/requireAuth";
import prisma from "@/lib/prisma";

export default async function LikedImagesPage() {
    const session = await requireAuth();

    const likedImages = await prisma.like.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            image: {
                select: {
                    id: true,
                    imageUrl: true,
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
            },
        },
    });

    // fetch user's saves for these liked images
    const likedImageIds = likedImages.map((like) => like.image.id);
    const userSaves = await prisma.save.findMany({
        where: {
            userId: session.user.id,
            imageId: {
                in: likedImageIds,
            },
        },
        select: {
            imageId: true,
        },
    });
    const savedImageIds = userSaves.map((save) => save.imageId);

    return (
        <div className="min-h-screen bg-background w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-4 text-center">
                    Liked images
                </h1>
                <div className="text-center mb-8">
                    <p className="text-muted-foreground text-sm">
                        Here are the images you have liked from the community
                    </p>
                </div>
                <ResponsiveMasonryGrid>
                    {likedImages.map((image) => (
                        <ImagePostCard
                            key={image.image.id}
                            imageSrc={image.image.imageUrl}
                            authorImg={image.image.user.image || undefined}
                            authorName={image.image.user.name || undefined}
                            authorId={image.image.user.id}
                            index={image.image.id}
                            initialLiked={true}
                            initialSaved={savedImageIds.includes(
                                image.image.id
                            )}
                            likesCount={image.image._count.likes}
                        />
                    ))}
                </ResponsiveMasonryGrid>
            </div>
        </div>
    );
}
