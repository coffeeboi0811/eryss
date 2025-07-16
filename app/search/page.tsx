import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";

export default function SearchPage() {
    return (
        <div className="min-h-screen bg-white w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Search results for ....
                </h1>
                <Tabs defaultValue="images" className="w-full">
                    <div className="flex justify-center mb-8 sticky top-16 bg-white z-10">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                            <TabsTrigger
                                value="images"
                                className="text-base font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                            >
                                Images
                            </TabsTrigger>
                            <TabsTrigger
                                value="users"
                                className="text-base font-medium data-[state=active]:bg-gray-900 data-[state=active]:text-white"
                            >
                                Users
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="images" className="mt-0">
                        <ResponsiveMasonryGrid>
                            {imagePosts.map((post, index) => (
                                <ImagePostCard
                                    key={`images-${index}`}
                                    imageSrc={post.imageSrc}
                                    authorImg={post.authorImg}
                                    authorName={post.authorName}
                                    index={index}
                                />
                            ))}
                        </ResponsiveMasonryGrid>
                    </TabsContent>
                    <TabsContent value="users" className="mt-0">
                        <h1>Stuff here</h1>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
