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
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

interface User {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
}

interface ProfilePageDetailsProps {
    user: User;
    initialFollowStatus?: boolean;
    initialFollowerCount?: number;
}

export default function ProfilePageDetails({
    user,
    initialFollowStatus = false,
    initialFollowerCount = 0,
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
        if (!validateForm()) {
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
                    console.error("Profile update error:", data.error);
                    return;
                }
            }
            setIsDialogOpen(false);
            window.location.reload();
        } catch (error) {
            console.error("Network error:", error);
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

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Follow error:", errorData.error);
                return;
            }

            const data = await response.json();
            setIsFollowing(data.followed);

            if (data.followerCount !== undefined) {
                setFollowerCount(data.followerCount);
            } else {
                // fallback: manually update count
                setFollowerCount((prev) =>
                    data.followed ? prev + 1 : prev - 1
                );
            }
        } catch (error) {
            console.error("Failed to follow user:", error);
        } finally {
            setIsFollowLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/30 px-6 py-12">
            <div className="flex flex-col items-center space-y-8 max-w-lg text-center">
                <Avatar className="w-32 h-32 cursor-pointer shadow-lg">
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
                        <span>Joined March 2024</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">
                        {followerCount}{" "}
                        {followerCount === 1 ? "follower" : "followers"} • 342
                        likes • 21 images
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="shadow-sm cursor-pointer"
                    >
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
                            className={`cursor-pointer ${
                                isFollowing
                                    ? "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                                    : "bg-primary hover:bg-primary/90 text-primary-foreground"
                            }`}
                        >
                            {isFollowLoading
                                ? "Loading..."
                                : isFollowing
                                ? "Unfollow"
                                : "Follow"}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
