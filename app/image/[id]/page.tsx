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
        <div className="h-screen bg-white flex overflow-hidden">
            <div className="w-3/5 overflow-y-auto panel-scrollbar scroll-smooth">
                <ImageDetailLeftPanel
                    imageSrc={imageData.imageSrc}
                    authorImg={imageData.authorImg}
                    authorName={imageData.authorName}
                />
            </div>
            <div className="w-2/5 overflow-y-auto panel-scrollbar scroll-smooth">
                <ImageDetailRightPanel
                    relatedImages={relatedImages}
                    imagePosts={imagePosts}
                />
            </div>
        </div>
    );
}
