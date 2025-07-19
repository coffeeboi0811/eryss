import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import prisma from "@/lib/prisma";

export default async function Home() {
    const images = await prisma.image.findMany({
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
    return (
        <main className="w-full px-4 py-8">
            <ResponsiveMasonryGrid>
                {images.map((image) => (
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
