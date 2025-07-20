"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ImagePostCardProps {
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
    className?: string;
    index?: string;
    initialLiked?: boolean;
    initialSaved?: boolean;
    likesCount?: number;
}

export function ImagePostCard({
    imageSrc,
    authorImg,
    authorName,
    className,
    index,
    initialLiked = false,
    initialSaved = false,
    likesCount = 0,
}: ImagePostCardProps) {
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);

    const handleImageClick = () => {
        if (index !== undefined) {
            window.scrollTo(0, 0); // force scroll to top before navigation
            router.push(`/image/${index}`);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering image click
        if (isLiking || !index) return;

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
                    imageId: index,
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

    const handleSave = async (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering image click
        if (isSaving || !index) return;

        setIsSaving(true);
        const originalSaved = isSaved;

        // optimistic update
        setIsSaved(!isSaved);

        try {
            const response = await fetch("/api/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    imageId: index,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save image");
            }

            const data = await response.json();
            setIsSaved(data.saved);
        } catch (error) {
            console.error("Error saving image:", error);
            // revert optimistic update
            setIsSaved(originalSaved);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl shadow-sm transition-all cursor-zoom-in w-full block break-inside-avoid mb-4",
                className
            )}
            onClick={handleImageClick}
        >
            <Image
                src={imageSrc}
                alt="Image"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                <div className="p-3 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border-2 border-white cursor-pointer">
                            {authorImg ? (
                                <AvatarImage src={authorImg} alt={authorName} />
                            ) : (
                                <AvatarFallback className="bg-white/20 text-white text-xs">
                                    {authorName?.[0] || "A"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        {currentLikesCount > 0 && (
                            <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full">
                                {currentLikesCount}{" "}
                                {currentLikesCount === 1 ? "like" : "likes"}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 cursor-pointer transition-all duration-200 ${
                                isLiked
                                    ? "text-red-400 hover:bg-red-500/30"
                                    : "text-white hover:bg-red-500/30 hover:text-red-400"
                            }`}
                            onClick={handleLike}
                            disabled={isLiking}
                        >
                            <Heart
                                className={`w-4 h-4 ${
                                    isLiked ? "fill-current" : ""
                                }`}
                            />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className={`h-8 w-8 p-0 cursor-pointer transition-all duration-200 ${
                                isSaved
                                    ? "text-blue-400 hover:bg-blue-500/30"
                                    : "text-white hover:bg-blue-500/30 hover:text-blue-400"
                            }`}
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Bookmark
                                className={`w-4 h-4 ${
                                    isSaved ? "fill-current" : ""
                                }`}
                            />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-green-500/30 hover:text-green-400 h-8 w-8 p-0 cursor-pointer transition-all duration-200"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
