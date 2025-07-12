"use client";

import { ImagePostCard } from "@/components/ImagePostCard";
import Masonry from "react-masonry-css";
import "@/components/masonry.css";

interface ImageDetailRightPanelProps {
    relatedImages: Array<{
        imageSrc: string;
        authorImg?: string;
        authorName?: string;
    }>;
    imagePosts: Array<{
        imageSrc: string;
        authorImg?: string;
        authorName?: string;
    }>;
}

export function ImageDetailRightPanel({
    relatedImages,
    imagePosts,
}: ImageDetailRightPanelProps) {
    return (
        <div className="bg-white border-l border-gray-200">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Related Images
                </h2>
                <Masonry
                    breakpointCols={{
                        default: 2,
                        1024: 2,
                        768: 1,
                    }}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column"
                >
                    {relatedImages.map((post, index) => (
                        <ImagePostCard
                            key={index}
                            imageSrc={post.imageSrc}
                            authorImg={post.authorImg}
                            authorName={post.authorName}
                            index={imagePosts.findIndex((p) => p === post)}
                        />
                    ))}
                </Masonry>
            </div>
        </div>
    );
}
