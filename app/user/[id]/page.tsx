import ProfilePageDetails from "@/components/ProfilePageDetails";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/authSession";
import { Metadata } from "next";

interface UserProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export async function generateMetadata({
    params,
}: UserProfilePageProps): Promise<Metadata> {
    const { id } = await params;
    // fetch the user for metadata
    const user = await prisma.user.findUnique({
        where: { id },
        select: {
            name: true,
            bio: true,
            image: true,
            _count: {
                select: {
                    images: true,
                    followers: true,
                },
            },
        },
    });
    if (!user) {
        return {
            title: "User not found • Eryss",
            description: "The user profile you're looking for doesn't exist",
        };
    }
    const title = `${user.name || "User"} • Eryss`;
    const description = user.bio
        ? `${user.bio.slice(0, 160)}...`
        : `${user.name || "User"} has shared ${
              user._count.images
          } visual creations and has ${
              user._count.followers
          } followers on Eryss`;
    const ogImageUrl = user.image || "/og-default.png";
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: [
                {
                    url: ogImageUrl,
                    alt: `${user.name || "User"}'s profile on Eryss`,
                },
            ],
            type: "profile",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImageUrl],
        },
    };
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
                {userImages.length > 0 ? (
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
                ) : (
                    <div className="text-center py-16">
                        {session?.user?.id === user.id ? (
                            <>
                                <p className="text-muted-foreground text-lg">
                                    You have no posts yet
                                </p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Create some amazing content to share with
                                    the community
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground text-lg">
                                    @{user.name || "User"} has no posts yet
                                </p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Check back later for new content
                                </p>
                            </>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
