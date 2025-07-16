"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Star, Bookmark, Heart } from "lucide-react";
import { useRouter } from "next/navigation";

export function UserMenu() {
    const router = useRouter();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-transparent hover:border-gray-300 transition w-11 h-11">
                    <AvatarImage src="" alt="User profile" />
                    <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white font-bold text-lg">
                        U
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-64 p-2 space-y-3 shadow-lg border border-gray-200 rounded-lg relative"
            >
                <div className="absolute -top-2 right-4 w-4 h-4 bg-white border border-gray-200 rotate-45 transform origin-bottom-left"></div>
                <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer text-xl"
                    onClick={() => router.push("/user/retard")}
                >
                    <Avatar className="w-12 h-12">
                        <AvatarImage src="" alt="User profile" />
                        <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white font-bold text-lg">
                            U
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-lg font-medium truncate">
                            Retardddd
                        </span>
                        <span className="text-sm text-gray-500 truncate">
                            bitchassssmfffffff@gmail.com
                        </span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:text-pink-600"
                    onClick={() => router.push("/likes")}
                >
                    <Heart className="w-4 h-4 text-pink-500" />
                    Liked images
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:text-blue-600"
                    onClick={() => router.push("/saved")}
                >
                    <Bookmark className="w-4 h-4 text-blue-500" />
                    Saved images
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer hover:text-yellow-600"
                    onClick={() =>
                        window.open(
                            "https://github.com/coffeeboi0811/eryss",
                            "_blank"
                        )
                    }
                >
                    <Star className="w-4 h-4 text-yellow-500" />
                    Star on GitHub
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-600 cursor-pointer">
                    <LogOut className="w-4 h-4 text-red-600" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
