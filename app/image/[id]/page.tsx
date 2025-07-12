import { ImageDetailPageWrapper } from "@/components/ImageDetailPageWrapper";
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
        <ImageDetailPageWrapper
            imageData={imageData}
            relatedImages={relatedImages}
            imagePosts={imagePosts}
        />
    );
}
