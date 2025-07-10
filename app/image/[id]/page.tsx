import { ImageDetailLeftPanel } from "@/components/ImageDetailLeftPanel";
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

    return (
        <div className="min-h-screen bg-white flex">
            <ImageDetailLeftPanel
                imageSrc={imageData.imageSrc}
                authorImg={imageData.authorImg}
                authorName={imageData.authorName}
            />
            {/* right panel */}
            <div className="w-1/2 h-screen overflow-y-auto bg-white border-l border-gray-200">
                <div className="p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">
                        Related Images
                    </h2>
                    <p className="text-gray-500 text-center py-12">
                        Related content will be added here
                    </p>
                </div>
            </div>
        </div>
    );
}
