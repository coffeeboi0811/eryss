"use client";

import { useEffect } from "react";
import { ImageDetailLeftPanel } from "@/components/ImageDetailLeftPanel";
import { ImageDetailRightPanel } from "@/components/ImageDetailRightPanel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImageDetailPageWrapperProps {
    imageData: {
        imageSrc: string;
        authorImg?: string;
        authorName?: string;
    };
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

export function ImageDetailPageWrapper({
    imageData,
    relatedImages,
    imagePosts,
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
                        imageSrc={imageData.imageSrc}
                        authorImg={imageData.authorImg}
                        authorName={imageData.authorName}
                    />
                </div>
            </div>
            {/* right panel - hidden on mobile */}
            <div className="hidden md:block w-2/5 overflow-y-auto panel-scrollbar scroll-smooth">
                <div className="pb-12 px-4">
                    <ImageDetailRightPanel
                        relatedImages={relatedImages}
                        imagePosts={imagePosts}
                    />
                </div>
            </div>
        </div>
    );
}
