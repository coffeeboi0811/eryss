"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Share, UserPlus, UserMinus, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";

interface User {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
    createdAt: Date;
}

interface ProfilePageDetailsProps {
    user: User;
    initialFollowStatus?: boolean;
    initialFollowerCount?: number;
    imageCount: number;
    likeCount: number;
}

export default function ProfilePageDetails({
    user,
    initialFollowStatus = false,
    initialFollowerCount = 0,
    imageCount,
    likeCount,
}: ProfilePageDetailsProps) {
    const { data: session, status } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editedName, setEditedName] = useState(user.name || "");
    const [editedBio, setEditedBio] = useState(user.bio || "");
    const [nameError, setNameError] = useState("");
    const [bioError, setBioError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialFollowStatus);
    const [followerCount, setFollowerCount] = useState(initialFollowerCount);
    const [isFollowLoading, setIsFollowLoading] = useState(false);

    const router = useRouter();

    const userInitials = user.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";
    const userHandle =
        user.name
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "") || "user";

    const validateForm = () => {
        let isValid = true;

        if (editedName.trim().length < 3) {
            setNameError("Username must be at least 3 characters long");
            isValid = false;
        } else if (editedName.trim().length > 20) {
            setNameError("Username must be less than 20 characters");
            isValid = false;
        } else {
            setNameError("");
        }

        if (editedBio.length > 160) {
            setBioError("Bio must be less than 160 characters");
            isValid = false;
        } else {
            setBioError("");
        }

        return isValid;
    };

    const handleUpdate = async () => {
        if (!validateForm() || isUpdating) {
            return;
        }
        setIsUpdating(true);
        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: editedName.trim(),
                    bio: editedBio,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                // handle structured validation errors from zod
                if (data.details && Array.isArray(data.details)) {
                    data.details.forEach(
                        (detail: { field: string; message: string }) => {
                            if (detail.field === "name") {
                                setNameError(detail.message);
                            } else if (detail.field === "bio") {
                                setBioError(detail.message);
                            }
                        }
                    );
                    return;
                } else if (data.error) {
                    // handle generic errors
                    toast.error(data.error || "Failed to update profile");
                    return;
                }
            }
            setIsDialogOpen(false);
            toast.success("Profile updated successfully!");
            router.refresh();
        } catch (error) {
            console.error("Network error:", error);
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setIsUpdating(false);
        }
    };

    const handleFollow = async () => {
        if (isFollowLoading) return;
        setIsFollowLoading(true);
        try {
            const response = await fetch(`/api/profile/${user.id}/follow`, {
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
            setFollowerCount((prev) => (data.followed ? prev + 1 : prev - 1));
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
            const profileUrl = `${window.location.origin}/user/${user.id}`;
            await navigator.clipboard.writeText(profileUrl);
            toast.success("Profile link copied to clipboard!");
        } catch (error) {
            console.error("Failed to copy link:", error);
            toast.error("Failed to copy link");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/30 px-6 py-12">
            <div className="flex flex-col items-center space-y-8 max-w-lg text-center">
                <Avatar className="w-32 h-32 cursor-pointer shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                    <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User Avatar"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-foreground">
                            {user.name || "Unknown User"}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <span className="text-sm font-semibold">
                                @{userHandle}
                            </span>
                        </div>
                    </div>
                    <p className="text-foreground text-base leading-relaxed max-w-md mx-auto">
                        {user.bio || "No bio available"}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>
                            Joined{" "}
                            {user.createdAt
                                ? formatDistanceToNow(
                                      new Date(user.createdAt),
                                      {
                                          addSuffix: true,
                                      }
                                  )
                                : "recently"}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">
                        {followerCount}{" "}
                        {followerCount === 1 ? "follower" : "followers"} •{" "}
                        {likeCount} {likeCount === 1 ? "like" : "likes"} •{" "}
                        {imageCount} {imageCount === 1 ? "image" : "images"}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="shadow-sm cursor-pointer"
                        onClick={handleShare}
                    >
                        <Share className="w-4 h-4 mr-2" />
                        Share
                    </Button>
                    {status === "loading" ? (
                        <Skeleton className="h-10 w-24 rounded-md" />
                    ) : session?.user.id === user.id ? (
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Edit profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className="sm:max-w-[425px]"
                                onPointerDownOutside={(e) => e.preventDefault()}
                                onEscapeKeyDown={(e) => e.preventDefault()}
                            >
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        update when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium"
                                        >
                                            Username
                                        </label>
                                        <Input
                                            id="name"
                                            value={editedName}
                                            onChange={(e) => {
                                                setEditedName(e.target.value);
                                                setNameError("");
                                            }}
                                            placeholder="Enter your username"
                                            className={
                                                nameError
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {nameError && (
                                            <p className="text-sm text-red-500">
                                                {nameError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="bio"
                                            className="text-sm font-medium"
                                        >
                                            Bio{" "}
                                            <span className="text-muted-foreground">
                                                (optional)
                                            </span>
                                        </label>
                                        <Textarea
                                            id="bio"
                                            value={editedBio}
                                            onChange={(e) => {
                                                setEditedBio(e.target.value);
                                                setBioError("");
                                            }}
                                            placeholder="Tell us about yourself"
                                            rows={5}
                                            className={`resize-none ${
                                                bioError ? "border-red-500" : ""
                                            }`}
                                        />
                                        <div className="flex justify-between items-center">
                                            {bioError && (
                                                <p className="text-sm text-red-500">
                                                    {bioError}
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground ml-auto">
                                                {editedBio.length}/160
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="cursor-pointer"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpdate}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? "Updating..." : "Update"}
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button
                            onClick={handleFollow}
                            disabled={isFollowLoading}
                            variant={isFollowing ? "outline" : "default"}
                            className={`cursor-pointer transition-all duration-200 ${
                                isFollowing
                                    ? "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:scale-105"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105"
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
        </div>
    );
}
