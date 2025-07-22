"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface UserSearchResultProps {
    avatarSrc: string;
    fullName: string;
    bio: string;
    userId: string;
    followersCount?: number;
}

export function UserSearchResult({
    avatarSrc,
    fullName,
    bio,
    userId,
    followersCount = 0,
}: UserSearchResultProps) {
    const router = useRouter();
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
                    {followersCount}{" "}
                    {followersCount === 1 ? "follower" : "followers"}
                </p>
                <p className="text-foreground text-sm leading-5">
                    {truncatedBio || "No bio available"}
                </p>
            </div>
            <Button
                size="sm"
                className="rounded-full px-6 py-2 font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow cursor-pointer"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                Follow
            </Button>
        </div>
    );
}
