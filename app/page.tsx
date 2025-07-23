import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import prisma from "@/lib/prisma";
import { shuffleArray } from "@/lib/shuffleArray";
import { getAuthSession } from "@/lib/authSession";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Eryss",
    description: "Discover and share visual inspiration",
    openGraph: {
        title: "Eryss",
        description: "Discover and share visual inspiration",
        images: ["/og-default.png"],
    },
};

export default async function Home() {
    const session = await getAuthSession();

    const images = await prisma.image.findMany({
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

    const shuffledImages = shuffleArray(images);
    return (
        <main className="w-full px-4 py-8">
            <ResponsiveMasonryGrid>
                {shuffledImages.map((image) => (
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
    );
}
