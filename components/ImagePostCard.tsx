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
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { itemVariants } from "@/components/ResponsiveMasonryGrid";

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
    const pathname = usePathname();
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const likeVariants = {
        idle: { scale: 1 },
        liked: {
            scale: [1, 1.3, 1.1, 1],
            transition: {
                duration: 0.4,
                times: [0, 0.3, 0.7, 1],
            },
        },
    };

    const handleImageClick = () => {
        if (index !== undefined) {
            window.scrollTo(0, 0); // force scroll to top before navigation
            router.push(`/image/${index}`);
        }
    };

    const handleLike = async (e: React.MouseEvent) => {
        e.stopPropagation();
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

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to like image");
                // revert optimistic update
                setIsLiked(originalLiked);
                setCurrentLikesCount(originalCount);
                return;
            }

            setIsLiked(data.liked);
            // update likes count based on the response
            setCurrentLikesCount(
                data.liked ? originalCount + 1 : originalCount - 1
            );

            // refresh the page if on likes page or explore page to update the UI
            if (pathname === "/likes" || pathname === "/explore") {
                router.refresh();
            }
        } catch (error) {
            console.error("Error liking image:", error);
            toast.error("Failed to like image. Please try again.");
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

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to save image");
                // revert optimistic update
                setIsSaved(originalSaved);
                return;
            }

            setIsSaved(data.saved);

            // refresh the page if on saved page to update the UI
            if (pathname === "/saved") {
                router.refresh();
            }
        } catch (error) {
            console.error("Error saving image:", error);
            toast.error("Failed to save image. Please try again.");
            // revert optimistic update
            setIsSaved(originalSaved);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDeleting || !index) return;
        setIsDeleting(true);
        setShowDeleteDialog(false);
        try {
            const response = await fetch(`/api/images/${index}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to delete image");
                return;
            }

            toast.success("Image deleted successfully");
            router.refresh();
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownload = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${authorName || "image"}_${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            URL.revokeObjectURL(url); // delete the temporary blob url to avoid memory leaks
        } catch (error) {
            console.error("Download failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const isAuthor = session?.user?.id === authorId;

    return (
        <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
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
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setShowDeleteDialog(true);
                                }}
                                disabled={isDeleting}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                {isDeleting ? "Deleting..." : "Delete Image"}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Image</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this image? This
                            action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            className="cursor-pointer"
                            onClick={(e) => e.stopPropagation()}
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 cursor-pointer text-white"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end z-10">
                <div className="p-3 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Avatar
                                    className="w-8 h-8 border-2 border-white cursor-pointer"
                                    onClick={(
                                        e: React.MouseEvent<HTMLDivElement>
                                    ) => {
                                        e.stopPropagation();
                                        router.push(`/user/${authorId}`);
                                    }}
                                >
                                    {authorImg ? (
                                        <AvatarImage
                                            src={authorImg}
                                            alt={authorName}
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-white/20 text-white text-xs">
                                            {authorName?.[0] || "A"}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                                {authorName || "View profile"}
                            </TooltipContent>
                        </Tooltip>
                        {currentLikesCount > 0 && (
                            <span className="text-white text-xs font-medium bg-black/30 px-2 py-1 rounded-full">
                                {currentLikesCount}{" "}
                                {currentLikesCount === 1 ? "like" : "likes"}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
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
                                    <motion.div
                                        variants={likeVariants}
                                        animate={isLiked ? "liked" : "idle"}
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${
                                                isLiked ? "fill-current" : ""
                                            }`}
                                        />
                                    </motion.div>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {isLiked ? "Unlike" : "Like"}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                                {isSaved ? "Unsave" : "Save"}
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-white hover:bg-green-500/30 hover:text-green-400 h-8 w-8 p-0 cursor-pointer transition-all duration-200"
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                >
                                    <Download className="w-4 h-4" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
