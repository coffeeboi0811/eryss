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
        <div className="flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors">
            <Avatar className="w-14 h-14 flex-shrink-0 cursor-pointer">
                <AvatarImage src={avatarSrc} alt={fullName} />
                <AvatarFallback>{fullName.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-base">
                        {fullName}
                    </h3>
                </div>
                <p className="text-gray-600 text-sm mb-1">@{handle}</p>
                <p className="text-gray-500 text-sm mb-2">
                    {followerCount} followers
                </p>
                <p className="text-gray-700 text-sm leading-5">
                    {truncatedBio}
                </p>
            </div>

            <Button
                variant="outline"
                className="px-6 py-2 rounded-full font-medium flex-shrink-0 cursor-pointer"
            >
                Follow
            </Button>
        </div>
    );
}
