"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download, Share, Clock } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ImageDetailLeftPanelProps {
    imageId: string;
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
    title?: string;
    description?: string;
    createdAt?: Date;
    initialLiked?: boolean;
    likesCount?: number;
}

export function ImageDetailLeftPanel({
    imageId,
    imageSrc,
    authorImg,
    authorName,
    title,
    description,
    createdAt,
    initialLiked = false,
    likesCount = 0,
}: ImageDetailLeftPanelProps) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isLiking, setIsLiking] = useState(false);
    const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);

    const handleLike = async () => {
        if (isLiking) return;

        setIsLiking(true);
        const originalLiked = isLiked;
        const originalCount = currentLikesCount;

        // optimistic update
        setIsLiked(!isLiked);
        setCurrentLikesCount(
            isLiked ? currentLikesCount - 1 : currentLikesCount + 1
        );

        try {
            const response = await fetch("/api/like", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageId: imageId,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to like image");
            }

            const data = await response.json();
            setIsLiked(data.liked);
            // update likes count based on the response
            setCurrentLikesCount(
                data.liked ? originalCount + 1 : originalCount - 1
            );
        } catch (error) {
            console.error("Error liking image:", error);
            // revert optimistic update
            setIsLiked(originalLiked);
            setCurrentLikesCount(originalCount);
        } finally {
            setIsLiking(false);
        }
    };
    return (
        <div className="flex flex-col h-full bg-muted/30">
            <div className="w-full h-full bg-background rounded-none shadow-none overflow-hidden flex flex-col">
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
                <div className="w-full border-t border-border" />
                <div className="mx-6 mt-6 mb-4 bg-card rounded-xl p-5 shadow-sm border border-border">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 shadow cursor-pointer">
                            {authorImg ? (
                                <AvatarImage src={authorImg} alt={authorName} />
                            ) : (
                                <AvatarFallback className="bg-muted text-muted-foreground cursor-pointer">
                                    {authorName?.[0] || "A"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <span className="font-semibold text-lg text-foreground">
                                {authorName}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                                1.2k followers
                            </span>
                        </div>
                        <div className="flex-1" />
                        <Button
                            size="sm"
                            className="rounded-full px-6 py-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow cursor-pointer"
                        >
                            Follow
                        </Button>
                    </div>
                </div>
                <div className="w-full border-t border-border" />
                <div className="px-6 pt-6 pb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-3 leading-tight">
                        {title || "Untitled"}
                    </h1>
                    <div className="w-full mb-4">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>
                                Posted{" "}
                                {createdAt
                                    ? new Date(createdAt).toLocaleDateString()
                                    : "recently"}
                            </span>
                            {currentLikesCount > 0 && (
                                <>
                                    <span className="text-muted-foreground">
                                        •
                                    </span>
                                    <span className="text-foreground font-semibold">
                                        {currentLikesCount}{" "}
                                        {currentLikesCount === 1
                                            ? "like"
                                            : "likes"}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {description && (
                        <p className="text-base text-foreground leading-relaxed mb-6">
                            {description}
                        </p>
                    )}
                    <div className="w-full border-t border-border mb-6" />
                    <div className="flex gap-3 mb-8 md:mb-0 overflow-x-auto">
                        <Button
                            className={`flex-1 shadow cursor-pointer ${
                                isLiked
                                    ? "bg-red-600 hover:bg-red-700 text-white"
                                    : "bg-muted hover:bg-red-600 hover:text-white text-foreground"
                            }`}
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            <Heart
                                className={`w-4 h-4 mr-2 ${
                                    isLiked ? "fill-current" : ""
                                }`}
                            />
                            {isLiking ? "..." : isLiked ? "Liked" : "Like"}
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
