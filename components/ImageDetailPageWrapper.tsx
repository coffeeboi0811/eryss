"use client";

import { useEffect } from "react";
import { ImageDetailLeftPanel } from "@/components/ImageDetailLeftPanel";
import { ImageDetailRightPanel } from "@/components/ImageDetailRightPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImageDetailPageWrapperProps {
    imageId: string;
    imageData: {
        imageSrc: string;
        authorImg?: string;
        authorName?: string;
        authorId?: string;
        title?: string;
        description?: string;
        createdAt?: Date;
        likesCount?: number;
        followersCount?: number;
    };
    relatedImages: Array<{
        id: string;
        imageSrc: string;
        authorImg?: string;
        authorName?: string;
        authorId?: string;
        initialLiked?: boolean;
        initialSaved?: boolean;
        likesCount?: number;
    }>;
    initialLiked?: boolean;
    initialSaved?: boolean;
}

export function ImageDetailPageWrapper({
    imageId,
    imageData,
    relatedImages,
    initialLiked = false,
    initialSaved = false,
}: ImageDetailPageWrapperProps) {
    const router = useRouter();

    useEffect(() => {
        // hide body scroll for "this page only"
        document.body.style.overflow = "hidden";
        return () => {
            // restore body scroll "when leaving this page"
            document.body.style.overflow = "";
        };
    }, []);

    return (
        <div className="h-screen bg-background flex overflow-hidden relative">
            {/* fixed back button */}
            <div className="fixed top-20 left-4 z-50">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="bg-background/80 backdrop-blur-sm hover:bg-accent text-foreground cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </Button>
            </div>
            {/* left panel */}
            <div className="w-full md:w-3/5 overflow-y-auto panel-scrollbar scroll-smooth">
                <div className="pb-20 md:pb-12 px-4">
                    <ImageDetailLeftPanel
                        imageId={imageId}
                        imageSrc={imageData.imageSrc}
                        authorImg={imageData.authorImg}
                        authorName={imageData.authorName}
                        authorId={imageData.authorId}
                        title={imageData.title}
                        description={imageData.description}
                        createdAt={imageData.createdAt}
                        initialLiked={initialLiked}
                        initialSaved={initialSaved}
                        likesCount={imageData.likesCount}
                        followersCount={imageData.followersCount}
                    />
                </div>
            </div>
            {/* right panel - hidden on mobile */}
            <div className="hidden md:block w-2/5 overflow-y-auto panel-scrollbar scroll-smooth">
                <div className="pb-12 px-4">
                    <ImageDetailRightPanel relatedImages={relatedImages} />
                </div>
            </div>
        </div>
    );
}
