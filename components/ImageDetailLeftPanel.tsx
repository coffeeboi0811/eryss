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
    UserPlus,
    UserMinus,
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
import { formatDistanceToNow } from "date-fns";

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
    followersCount?: number;
    initialFollowing?: boolean;
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
    followersCount = 0,
    initialFollowing = false,
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
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [currentFollowersCount, setCurrentFollowersCount] =
        useState(followersCount);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const userHandle =
        authorName
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "") || "user";

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

            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to save image");
                // revert optimistic update
                setIsSaved(originalSaved);
                return;
            }

            setIsSaved(data.saved);
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
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to delete image");
                return;
            }

            toast.success("Image deleted successfully");
            router.push("/");
        } catch (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image. Please try again.");
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
            toast.error("Failed to download image. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleFollow = async () => {
        if (isFollowLoading || !authorId) return;
        setIsFollowLoading(true);
        try {
            const response = await fetch(`/api/profile/${authorId}/follow`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (!response.ok) {
                toast.error(data.error || "Failed to follow user");
                return;
            }

            setIsFollowing(data.followed);
            // optimistically update follower count
            setCurrentFollowersCount((prev) =>
                data.followed ? prev + 1 : prev - 1
            );
            toast.success(
                data.followed
                    ? `You are now following @${userHandle}`
                    : `Unfollowed @${userHandle}`
            );
        } catch (error) {
            console.error("Failed to follow user:", error);
            toast.error("Failed to follow user. Please try again.");
        } finally {
            setIsFollowLoading(false);
        }
    };

    const handleShare = async () => {
        try {
            const imageUrl = `${window.location.origin}/image/${imageId}`;
            await navigator.clipboard.writeText(imageUrl);
            toast.success("Link copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy link:", error);
            toast.error("Failed to copy link");
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
                <div
                    className="mx-6 mt-6 mb-4 bg-card rounded-xl p-5 shadow-sm border border-border hover:bg-accent/75 transition-colors cursor-pointer"
                    onClick={() => router.push(`/user/${authorId}`)}
                >
                    <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 shadow">
                            {authorImg ? (
                                <AvatarImage src={authorImg} alt={authorName} />
                            ) : (
                                <AvatarFallback className="bg-muted text-muted-foreground">
                                    {authorName?.[0] || "A"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                        <div className="flex flex-col justify-center">
                            <span className="font-semibold text-lg text-foreground">
                                {authorName}
                            </span>
                            <span className="text-xs text-muted-foreground mt-0.5">
                                {currentFollowersCount}{" "}
                                {currentFollowersCount === 1
                                    ? "follower"
                                    : "followers"}
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
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
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
                                                <AlertDialogCancel
                                                    className="cursor-pointer"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
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
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFollow();
                                }}
                                disabled={isFollowLoading}
                                variant={isFollowing ? "outline" : "default"}
                                className={`rounded-full px-6 py-2 font-semibold shadow cursor-pointer transition-all duration-200 ${
                                    isFollowing
                                        ? "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:scale-105"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105"
                                }`}
                            >
                                {isFollowLoading ? (
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                        Loading...
                                    </div>
                                ) : isFollowing ? (
                                    <>
                                        <UserMinus className="w-4 h-4 mr-2" />
                                        Unfollow
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Follow
                                    </>
                                )}
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
                                    ? formatDistanceToNow(new Date(createdAt), {
                                          addSuffix: true,
                                      })
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
                    <div className="flex flex-wrap gap-3 mb-8 md:mb-0 overflow-hidden">
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
                            onClick={handleShare}
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
                            className="flex-1 shadow-sm cursor-pointer hover:scale-105 transition-all duration-200"
                            onClick={handleDownload}
                            disabled={isDownloading}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {isDownloading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                    Downloading...
                                </div>
                            ) : (
                                "Download"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
