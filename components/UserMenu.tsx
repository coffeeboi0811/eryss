"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    LogOut,
    Star,
    Bookmark,
    Heart,
    Monitor,
    Sun,
    Moon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";

export function UserMenu() {
    const router = useRouter();
    const { setTheme, theme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-transparent hover:border-muted transition w-11 h-11">
                    <AvatarImage src="" alt="User profile" />
                    <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white font-bold text-lg">
                        U
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 space-y-3">
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
                        <span className="text-sm text-muted-foreground truncate">
                            bitchassssmfffffff@gmail.com
                        </span>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex flex-col gap-2 py-2">
                    <span className="text-sm text-foreground mb-1">Theme</span>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={theme === "system" ? "default" : "outline"}
                            size="icon"
                            className="rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                            onClick={() => setTheme("system")}
                        >
                            <Monitor className="w-5 h-5" />
                        </Button>
                        <Button
                            variant={theme === "light" ? "default" : "outline"}
                            size="icon"
                            className="rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                            onClick={() => setTheme("light")}
                        >
                            <Sun className="w-5 h-5" />
                        </Button>
                        <Button
                            variant={theme === "dark" ? "default" : "outline"}
                            size="icon"
                            className="rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                            onClick={() => setTheme("dark")}
                        >
                            <Moon className="w-5 h-5" />
                        </Button>
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
                <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600 cursor-pointer"
                    onClick={() => signOut()}
                >
                    <LogOut className="w-4 h-4 text-red-600" />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
