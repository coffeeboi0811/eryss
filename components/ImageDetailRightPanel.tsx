"use client";

import { ImagePostCard } from "@/components/ImagePostCard";
import Masonry from "react-masonry-css";
import "@/components/masonry.css";

interface ImageDetailRightPanelProps {
    relatedImages: Array<{
        id: string;
        imageSrc: string;
        authorImg?: string;
        authorName?: string;
        initialLiked?: boolean;
    }>;
}

export function ImageDetailRightPanel({
    relatedImages,
}: ImageDetailRightPanelProps) {
    return (
        <div className="bg-background border-l border-border">
            <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">
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
                    {relatedImages.map((image) => (
                        <ImagePostCard
                            key={image.id}
                            imageSrc={image.imageSrc}
                            authorImg={image.authorImg}
                            authorName={image.authorName}
                            index={image.id}
                            initialLiked={image.initialLiked}
                        />
                    ))}
                </Masonry>
            </div>
        </div>
    );
}
