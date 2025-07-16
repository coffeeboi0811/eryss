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
        <div className="flex items-start gap-4 p-4 bg-gray-50 transition-colors shadow-sm border border-gray-100 rounded-xl hover:bg-gray-100">
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
                size="sm"
                className="rounded-full px-6 py-2 font-semibold bg-gray-900 text-white hover:bg-gray-800 shadow cursor-pointer"
            >
                Follow
            </Button>
        </div>
    );
}
