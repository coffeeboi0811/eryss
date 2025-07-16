import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";

export default function SavedImagesPage() {
    return (
        <div className="min-h-screen bg-white w-full">
            <div className="w-full px-4 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                    Saved images
                </h1>
                <div className="text-center mb-8">
                    <p className="text-gray-600 text-sm">
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
                            index={index}
                        />
                    ))}
                </ResponsiveMasonryGrid>
            </div>
        </div>
    );
}
