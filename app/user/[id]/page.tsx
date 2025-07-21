import ProfilePageDetails from "@/components/ProfilePageDetails";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/authSession";

interface UserProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function UserProfilePage({
    params,
}: UserProfilePageProps) {
    const { id } = await params;
    const session = await getAuthSession();

    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        omit: {
            email: true,
            emailVerified: true,
        },
        include: {
            _count: {
                select: {
                    images: true,
                    followers: true,
                    likes: true,
                },
            },
        },
    });

    if (!user) {
        notFound();
    }

    const userImages = await prisma.image.findMany({
        where: {
            userId: user.id,
        },
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
            _count: {
                select: {
                    likes: true,
                },
            },
        },
    });

    let userLikes: string[] = [];
    let userSaves: string[] = [];
    if (session?.user?.id) {
        const likes = await prisma.like.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                imageId: true,
            },
        });
        userLikes = likes.map((like) => like.imageId);

        const saves = await prisma.save.findMany({
            where: {
                userId: session.user.id,
            },
            select: {
                imageId: true,
            },
        });
        userSaves = saves.map((save) => save.imageId);
    }

    let isCurrentUserFollowing = false;
    if (session?.user?.id && session.user.id !== user.id) {
        const followRelation = await prisma.follow.findUnique({
            where: {
                followerId_followingId: {
                    followerId: session.user.id,
                    followingId: user.id,
                },
            },
        });
        isCurrentUserFollowing = !!followRelation;
    }

    return (
        <div>
            <ProfilePageDetails
                user={user}
                initialFollowerCount={user._count.followers}
                initialFollowStatus={isCurrentUserFollowing}
                likeCount={user._count.likes}
                imageCount={user._count.images}
            />
            <main className="w-full px-4 py-8">
                <ResponsiveMasonryGrid>
                    {userImages.map((image) => (
                        <ImagePostCard
                            key={image.id}
                            imageSrc={image.imageUrl}
                            authorImg={image.user.image || undefined}
                            authorName={image.user.name || undefined}
                            authorId={image.user.id}
                            index={image.id}
                            initialLiked={userLikes.includes(image.id)}
                            initialSaved={userSaves.includes(image.id)}
                            likesCount={image._count.likes}
                        />
                    ))}
                </ResponsiveMasonryGrid>
            </main>
        </div>
    );
}
