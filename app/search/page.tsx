import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { UserSearchResult } from "@/components/UserSearchResult";
import { imagePosts } from "@/lib/imagePostsData";
import { mockUsers } from "@/lib/userData";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q?.trim() || "";
    return (
        <div className="min-h-screen bg-background w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
                    Search results for: {query}
                </h1>
                <Tabs defaultValue="images" className="w-full">
                    <div className="flex justify-center mb-8 sticky top-16 bg-background z-10">
                        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
                            <TabsTrigger
                                value="images"
                                className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Images
                            </TabsTrigger>
                            <TabsTrigger
                                value="users"
                                className="text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-background rounded-lg flex flex-col gap-3">
                                {mockUsers.map((user, index) => (
                                    <UserSearchResult
                                        key={`user-${index}`}
                                        avatarSrc={user.avatarSrc}
                                        fullName={user.fullName}
                                        handle={user.handle}
                                        followerCount={user.followerCount}
                                        bio={user.bio}
                                    />
                                ))}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
