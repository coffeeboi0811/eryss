import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";
import { requireAuth } from "@/lib/requireAuth";

export default async function SavedImagesPage() {
    await requireAuth();
    return (
        <div className="min-h-screen bg-background w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-foreground mb-4 text-center">
                    Saved images
                </h1>
                <div className="text-center mb-8">
                    <p className="text-muted-foreground text-sm">
                        Here are the images you have saved from the community
                    </p>
                </div>
                <ResponsiveMasonryGrid>
                    {imagePosts.map((post, index) => (
                        <ImagePostCard
                            key={`now-${index}`}
                            imageSrc={post.imageSrc}
                            authorImg={post.authorImg}
                            authorName={post.authorName}
                            index={index.toString()}
                            initialLiked={false}
                        />
                    ))}
                </ResponsiveMasonryGrid>
            </div>
        </div>
    );
}
