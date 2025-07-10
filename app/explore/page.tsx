import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";

export default function ExplorePage() {
    return (
        <div className="min-h-screen bg-white w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Explore
                </h1>
                <Tabs defaultValue="now" className="w-full">
                    <div className="flex justify-center mb-8 sticky top-16 bg-white z-10">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                            <TabsTrigger
                                value="now"
                                className="text-base font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                            >
                                Now
                            </TabsTrigger>
                            <TabsTrigger
                                value="trending"
                                className="text-base font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                            >
                                Trending
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="now" className="mt-0">
                        <div className="text-center mb-6">
                            <p className="text-gray-600 text-sm">
                                Latest image posts from the community
                            </p>
                        </div>
                        <ResponsiveMasonryGrid>
                            {imagePosts.map((post, index) => (
                                <ImagePostCard
                                    key={`now-${index}`}
                                    imageSrc={post.imageSrc}
                                    authorImg={post.authorImg}
                                    authorName={post.authorName}
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
                                />
                            ))}
                        </ResponsiveMasonryGrid>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
