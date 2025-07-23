import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { SearchResults } from "@/components/SearchResults";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/authSession";
import { Metadata } from "next";

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
    }>;
}

export async function generateMetadata({
    searchParams,
}: SearchPageProps): Promise<Metadata> {
    const { q } = await searchParams;
    const query = q?.trim() || "";

    if (!query) {
        return {
            title: "Search • Eryss",
            description: "Search for visual content and discover creators",
            openGraph: {
                title: "Search • Eryss",
                description: "Search for visual content and discover creators",
                images: ["/og-default.png"],
            },
        };
    }
    const title = `"${query}" search results • Eryss`;
    const description = `Discover visual content and creators related to "${query}" on Eryss`;
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: ["/og-default.png"],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/og-default.png"],
        },
    };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { q } = await searchParams;
    const query = q?.trim() || "";
    const session = await getAuthSession();

    if (query === "") {
        redirect("/"); // redirect to home if no query
    }

    const searchedImages = await prisma.image.findMany({
        where: {
            OR: [
                {
                    title: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
                {
                    description: {
                        contains: query,
                        mode: "insensitive",
                    },
                },
            ],
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

    const searchedUsers = await prisma.user.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
        },
        select: {
            id: true,
            name: true,
            image: true,
            bio: true,
            _count: {
                select: {
                    followers: true,
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

    // fetch follow statuses for searched users
    let userFollowStatuses: string[] = [];
    if (session?.user?.id) {
        const searchedUserIds = searchedUsers.map((user) => user.id);
        const follows = await prisma.follow.findMany({
            where: {
                followerId: session.user.id,
                followingId: {
                    in: searchedUserIds,
                },
            },
            select: {
                followingId: true,
            },
        });
        userFollowStatuses = follows.map((follow) => follow.followingId);
    }

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
                        {searchedImages.length > 0 ? (
                            <ResponsiveMasonryGrid>
                                {searchedImages.map((image) => (
                                    <ImagePostCard
                                        key={image.id}
                                        imageSrc={image.imageUrl}
                                        authorImg={
                                            image.user.image || undefined
                                        }
                                        authorName={
                                            image.user.name || undefined
                                        }
                                        authorId={image.user.id}
                                        index={image.id}
                                        initialLiked={userLikes.includes(
                                            image.id
                                        )}
                                        initialSaved={userSaves.includes(
                                            image.id
                                        )}
                                        likesCount={image._count.likes}
                                    />
                                ))}
                            </ResponsiveMasonryGrid>
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground text-lg">
                                    No images found for &ldquo;{query}&rdquo;
                                </p>
                                <p className="text-muted-foreground text-sm mt-2">
                                    Try searching with different keywords
                                </p>
                            </div>
                        )}
                    </TabsContent>
                    <TabsContent value="users" className="mt-0">
                        <div className="max-w-4xl mx-auto">
                            <SearchResults
                                users={searchedUsers}
                                userFollowStatuses={userFollowStatuses}
                                query={query}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
