"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download, Share, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="w-full h-full bg-white rounded-none shadow-none overflow-hidden flex flex-col">
                <div className="flex items-center justify-center p-8">
                    <div className="relative max-w-full">
                        <Image
                            src={imageSrc}
                            alt="Image detail"
                            width={800}
                            height={600}
                            className="max-w-full object-cover rounded-2xl shadow-lg"
                            priority
                        />
                    </div>
                </div>
                <div className="w-full border-t border-gray-200" />
                <div className="mx-6 mt-6 mb-4 bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 shadow cursor-pointer">
                            {authorImg ? (
                                <AvatarImage src={authorImg} alt={authorName} />
                            ) : (
                                <AvatarFallback className="bg-gray-200 text-gray-600 cursor-pointer">
                                    {authorName?.[0] || "A"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <span className="font-semibold text-lg text-gray-900">
                                {authorName}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">
                                Artist
                            </span>
                            <span className="text-xs text-gray-400 mt-0.5">
                                1.2k followers
                            </span>
                        </div>
                        <div className="flex-1" />
                        <Button
                            size="sm"
                            className="rounded-full px-6 py-2 font-semibold bg-gray-900 text-white hover:bg-gray-800 shadow cursor-pointer"
                        >
                            Follow
                        </Button>
                    </div>
                </div>
                <div className="w-full border-t border-gray-100" />
                <div className="px-6 pt-6 pb-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                        Beautiful Image
                    </h1>
                    <div className="flex items-center gap-2 mb-4">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400 font-medium">
                            Posted 3 days ago
                        </span>
                    </div>
                    <p className="text-base text-gray-700 leading-relaxed mb-6">
                        A stunning piece of visual art that captures the essence
                        of creativity and imagination.
                    </p>
                    <div className="w-full border-t border-gray-100 mb-6" />
                    <div className="flex gap-3">
                        <Button className="flex-1 bg-red-600 hover:bg-red-700 text-white shadow cursor-pointer">
                            <Heart className="w-4 h-4 mr-2" />
                            Like
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 shadow-sm cursor-pointer"
                        >
                            <Share className="w-4 h-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 shadow-sm cursor-pointer"
                        >
                            <Bookmark className="w-4 h-4 mr-2" />
                            Save
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 shadow-sm cursor-pointer"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
