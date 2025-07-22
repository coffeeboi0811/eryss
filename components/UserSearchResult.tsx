"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface UserSearchResultProps {
    avatarSrc: string;
    fullName: string;
    bio: string;
    userId: string;
    followersCount?: number;
    initialFollowing?: boolean;
}

export function UserSearchResult({
    avatarSrc,
    fullName,
    bio,
    userId,
    followersCount = 0,
    initialFollowing = false,
}: UserSearchResultProps) {
    const router = useRouter();
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(initialFollowing);
    const [currentFollowersCount, setCurrentFollowersCount] =
        useState(followersCount);
    const [isFollowLoading, setIsFollowLoading] = useState(false);
    const truncatedBio =
        bio && bio.length > 120 ? bio.substring(0, 120) + "..." : bio;

    const userHandle =
        fullName
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "") || "user";

    const handleUserClick = () => {
        router.push(`/user/${userId}`);
    };

    const handleFollow = async () => {
        if (isFollowLoading) return;
        setIsFollowLoading(true);
        try {
            const response = await fetch(`/api/profile/${userId}/follow`, {
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

    return (
        <div
            className="flex items-start gap-4 p-4 bg-card transition-colors border border-border rounded-xl hover:bg-accent/75 cursor-pointer"
            onClick={handleUserClick}
        >
            <Avatar className="w-14 h-14 flex-shrink-0">
                <AvatarImage src={avatarSrc} alt={fullName} />
                <AvatarFallback>{fullName?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-base">
                        {fullName || "Unknown User"}
                    </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-2">
                    @{userHandle}
                </p>
                <p className="text-muted-foreground text-sm mb-2">
                    {currentFollowersCount}{" "}
                    {currentFollowersCount === 1 ? "follower" : "followers"}
                </p>
                <p className="text-foreground text-sm leading-5">
                    {truncatedBio || "No bio available"}
                </p>
            </div>
            {session?.user?.id !== userId ? (
                <Button
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleFollow();
                    }}
                    disabled={isFollowLoading}
                    variant={isFollowing ? "outline" : "default"}
                    className={`rounded-full px-6 py-2 font-semibold shadow cursor-pointer ${
                        isFollowing
                            ? "hover:bg-destructive hover:text-destructive-foreground hover:border-destructive"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                >
                    {isFollowLoading ? (
                        "Loading..."
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
            ) : null}
        </div>
    );
}
