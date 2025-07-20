import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";
import prisma from "@/lib/prisma";

export default async function ExplorePage() {
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
                                    index={image.id}
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
                            {imagePosts.map((post, index) => (
                                <ImagePostCard
                                    key={`trending-${index}`}
                                    imageSrc={post.imageSrc}
                                    authorImg={post.authorImg}
                                    authorName={post.authorName}
                                    index={index}
                                />
                            ))}
                        </ResponsiveMasonryGrid>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
