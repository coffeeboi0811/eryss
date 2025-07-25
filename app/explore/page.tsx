import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/authSession";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore • Eryss",
    description: "Explore trending visual content and discover new inspiration",
    openGraph: {
        title: "Explore • Eryss",
        description:
            "Explore trending visual content and discover new inspiration",
        images: ["/og-default.png"],
    },
};

export default async function ExplorePage() {
    const session = await getAuthSession();

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
            _count: {
                select: {
                    likes: true,
                },
            },
        },
    });

    const trendingImages = await prisma.image.findMany({
        orderBy: [
            {
                likes: {
                    _count: "desc",
                },
            },
            {
                createdAt: "desc",
            },
        ],
        take: 20, // limit to top 20 trending images
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
    return (
        <div className="min-h-screen bg-background w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
                    Explore
                </h1>
                <Tabs defaultValue="now" className="w-full">
                    <div className="flex justify-center mb-8 sticky top-16 bg-background z-10">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                            <TabsTrigger
                                value="now"
                                className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Now
                            </TabsTrigger>
                            <TabsTrigger
                                value="trending"
                                className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Trending
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="now" className="mt-0">
                        <div className="text-center mb-6">
                            <p className="text-gray-600 text-sm">
                                Latest images from the community
                            </p>
                        </div>
                        <ResponsiveMasonryGrid>
                            {images.map((image) => (
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
                    </TabsContent>
                    <TabsContent value="trending" className="mt-0">
                        <div className="text-center mb-6">
                            <p className="text-gray-600 text-sm">
                                Most loved images this week
                            </p>
                        </div>
                        <ResponsiveMasonryGrid>
                            {trendingImages.map((image) => (
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
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
