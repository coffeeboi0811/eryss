"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Heart,
    Bookmark,
    Download,
    Share,
    Clock,
    MoreVertical,
    Trash2,
} from "lucide-react";
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
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface ImageDetailLeftPanelProps {
    imageId: string;
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
    authorId?: string;
    title?: string;
    description?: string;
    createdAt?: Date;
    initialLiked?: boolean;
    initialSaved?: boolean;
    likesCount?: number;
}

export function ImageDetailLeftPanel({
    imageId,
    imageSrc,
    authorImg,
    authorName,
    authorId,
    title,
    description,
    createdAt,
    initialLiked = false,
    initialSaved = false,
    likesCount = 0,
}: ImageDetailLeftPanelProps) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isLiking, setIsLiking] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentLikesCount, setCurrentLikesCount] = useState(likesCount);
    const [isDownloading, setIsDownloading] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const handleSave = async () => {
        if (isSaving) return;

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
                    imageId: imageId,
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

    const handleDelete = async () => {
        if (isDeleting) return;
        setIsDeleting(true);
        setShowDeleteDialog(false);
        try {
            const response = await fetch(`/api/images/${imageId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to delete image");
            }

            toast.success("Image deleted successfully");
            router.push("/");
        } catch (error) {
            console.error("Error deleting image:", error);
            alert("Failed to delete image. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDownload = async () => {
        if (isDownloading) return;

        setIsDownloading(true);
        try {
            const response = await fetch(imageSrc);
            const blob = await response.blob();

            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `${
                title || authorName || "image"
            }_${Date.now()}.jpg`;
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
                <div className="mx-6 mt-6 mb-4 bg-card rounded-xl p-5 shadow-sm border border-border hover:bg-accent/50 transition-colors">
                    <div className="flex items-center gap-4">
                        <Avatar
                            className="w-12 h-12 shadow cursor-pointer"
                            onClick={() => router.push(`/user/${authorId}`)}
                        >
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
                        {status === "loading" ? (
                            <Skeleton className="h-8 w-20 rounded-full" />
                        ) : isAuthor ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-10 w-10 p-0 cursor-pointer rounded-full hover:bg-muted"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="w-40"
                                >
                                    <AlertDialog
                                        open={showDeleteDialog}
                                        onOpenChange={setShowDeleteDialog}
                                    >
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem
                                                className="text-red-600 focus:text-red-700 cursor-pointer"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    setShowDeleteDialog(true);
                                                }}
                                                disabled={isDeleting}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                {isDeleting
                                                    ? "Deleting..."
                                                    : "Delete Image"}
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>
                                                    Delete Image
                                                </AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to
                                                    delete this image? This
                                                    action cannot be undone.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="cursor-pointer">
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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                size="sm"
                                className="rounded-full px-6 py-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow cursor-pointer"
                            >
                                Follow
                            </Button>
                        )}
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
                            className={`flex-1 shadow cursor-pointer ${
                                isSaved
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "bg-muted hover:bg-blue-600 hover:text-white text-foreground"
                            }`}
                            onClick={handleSave}
                            disabled={isSaving}
                        >
                            <Bookmark
                                className={`w-4 h-4 mr-2 ${
                                    isSaved ? "fill-current" : ""
                                }`}
                            />
                            {isSaving ? "..." : isSaved ? "Saved" : "Save"}
                        </Button>
                        <Button
                            variant="outline"
                            className="flex-1 shadow-sm cursor-pointer"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {isDownloading ? "Downloading..." : "Download"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
