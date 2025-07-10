import { ImageDetailLeftPanel } from "@/components/ImageDetailLeftPanel";
import { ImageDetailRightPanel } from "@/components/ImageDetailRightPanel";
import { imagePosts } from "@/lib/imagePostsData";
import { notFound } from "next/navigation";

interface ImageDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ImageDetailPage({
    params,
}: ImageDetailPageProps) {
    const { id } = await params;
    const imageIndex = parseInt(id);
    const imageData = imagePosts[imageIndex];

    if (!imageData) {
        notFound();
    }
    const relatedImages = imagePosts.filter((_, index) => index !== imageIndex);

    return (
        <div className="min-h-screen bg-white flex">
            <ImageDetailLeftPanel
                imageSrc={imageData.imageSrc}
                authorImg={imageData.authorImg}
                authorName={imageData.authorName}
            />
            <ImageDetailRightPanel
                relatedImages={relatedImages}
                imagePosts={imagePosts}
            />
        </div>
    );
}
