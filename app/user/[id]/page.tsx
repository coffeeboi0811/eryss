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
        },
    });

    let userLikes: string[] = [];
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
    }
    return (
        <div>
            <ProfilePageDetails user={user} />
            <main className="w-full px-4 py-8">
                <ResponsiveMasonryGrid>
                    {userImages.map((image) => (
                        <ImagePostCard
                            key={image.id}
                            imageSrc={image.imageUrl}
                            authorImg={image.user.image || undefined}
                            authorName={image.user.name || undefined}
                            index={image.id}
                            initialLiked={userLikes.includes(image.id)}
                        />
                    ))}
                </ResponsiveMasonryGrid>
            </main>
        </div>
    );
}
