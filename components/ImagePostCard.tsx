"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download, MoreVertical, Trash2 } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ImagePostCardProps {
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
    authorId?: string;
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
    authorId,
    className,
    index,
    initialLiked = false,
    initialSaved = false,
    likesCount = 0,
}: ImagePostCardProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // prevent triggering image click
        if (isDeleting || !index) return;
        const confirmed = confirm(
            "Are you sure you want to delete this image? This action cannot be undone."
        );
        if (!confirmed) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/images/${index}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete image");
            }

            window.location.reload();
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const isAuthor = session?.user?.id === authorId;

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
            {isAuthor && (
                <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 cursor-pointer bg-black/50 hover:bg-black/70 text-white rounded-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <MoreVertical className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 z-50">
                            <DropdownMenuItem
                                className="text-red-600 focus:text-red-700 cursor-pointer"
                                onClick={handleDelete}
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {isDeleting ? "Deleting..." : "Delete Image"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end z-10">
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
