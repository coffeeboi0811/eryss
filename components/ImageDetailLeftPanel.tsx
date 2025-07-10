"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download, Share, ArrowLeft } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

interface ImageDetailLeftPanelProps {
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
}

export function ImageDetailLeftPanel({
    imageSrc,
    authorImg,
    authorName,
}: ImageDetailLeftPanelProps) {
    const router = useRouter();

    return (
        <div className="w-1/2 h-screen flex flex-col bg-gray-50 relative">
            <div className="absolute top-4 left-4 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Back
                </Button>
            </div>
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="relative max-w-full max-h-full">
                    <Image
                        src={imageSrc}
                        alt="Image detail"
                        width={800}
                        height={600}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        priority
                    />
                </div>
            </div>
            <div className="p-6 bg-white border-t border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar className="w-10 h-10">
                        {authorImg ? (
                            <AvatarImage src={authorImg} alt={authorName} />
                        ) : (
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                                {authorName?.[0] || "A"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div>
                        <p className="font-medium text-gray-900">
                            {authorName}
                        </p>
                        <p className="text-sm text-gray-500">Artist</p>
                    </div>
                </div>
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Beautiful Image
                    </h1>
                    <p className="text-gray-600">
                        A stunning piece of visual art that captures the essence
                        of creativity and imagination.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                    <Button variant="outline" className="flex-1">
                        <Share className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                        <Bookmark className="w-4 h-4 mr-2" />
                        Bookmark
                    </Button>
                    <Button variant="outline" className="flex-1">
                        <Download className="w-4 h-4 mr-2" />
                        Download
                    </Button>
                </div>
            </div>
        </div>
    );
}
