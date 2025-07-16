import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserSearchResultProps {
    avatarSrc: string;
    fullName: string;
    handle: string;
    followerCount: string;
    bio: string;
}

export function UserSearchResult({
    avatarSrc,
    fullName,
    handle,
    followerCount,
    bio,
}: UserSearchResultProps) {
    const truncatedBio = bio.length > 120 ? bio.substring(0, 120) + "..." : bio;

    return (
        <div className="flex items-start gap-4 p-4 bg-card transition-colors border border-border rounded-xl hover:bg-accent/50">
            <Avatar className="w-14 h-14 flex-shrink-0 cursor-pointer">
                <AvatarImage src={avatarSrc} alt={fullName} />
                <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground text-base">
                        {fullName}
                    </h3>
                </div>
                <p className="text-muted-foreground text-sm mb-1">@{handle}</p>
                <p className="text-muted-foreground text-sm mb-2">
                    {followerCount} followers
                </p>
                <p className="text-foreground text-sm leading-5">
                    {truncatedBio}
                </p>
            </div>
            <Button
                size="sm"
                className="rounded-full px-6 py-2 font-semibold bg-gray-900 text-white hover:bg-gray-800 shadow cursor-pointer"
            >
                Follow
            </Button>
        </div>
    );
}
