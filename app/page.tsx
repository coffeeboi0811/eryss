import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import prisma from "@/lib/prisma";
import { shuffleArray } from "@/lib/shuffleArray";

export default async function Home() {
    const images = await prisma.image.findMany({
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
                        index={image.id}
                    />
                ))}
            </ResponsiveMasonryGrid>
        </main>
    );
}
