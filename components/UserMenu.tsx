"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
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
import { Session } from "next-auth";

interface UserMenuProps {
    session: Session;
}

export function UserMenu({ session }: UserMenuProps) {
    const router = useRouter();
    const { setTheme, theme } = useTheme();

    const user = session?.user;
    const userInitials = user?.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer border-2 border-transparent hover:border-muted transition w-11 h-11">
                    <AvatarImage src={user?.image || ""} alt="Retard" />
                    <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white font-bold text-lg">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2 space-y-3">
                <DropdownMenuItem
                    className="flex items-center gap-3 cursor-pointer text-xl"
                    onClick={() => router.push(`/user/${user?.id}`)}
                >
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={user?.image || ""} alt="Retard" />
                        <AvatarFallback className="bg-gradient-to-tr from-fuchsia-500 to-pink-400 text-white font-bold text-lg">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-lg font-medium truncate">
                            {user?.name || "Retard"}
                        </span>
                        <span className="text-sm text-muted-foreground truncate">
                            {user?.email || "No email"}
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
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem
                            className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-100 dark:hover:bg-red-950/20 not-dark:hover:text-red-600 dark:hover:text-red-600 dark:hover:font-bold not-dark:hover:font-bold"
                            onSelect={(e) => e.preventDefault()}
                        >
                            <LogOut className="w-4 h-4 text-red-600" />
                            Log out
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Are you sure you want to log out?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                You will be signed out of your account and
                                redirected to the home page.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel className="cursor-pointer">
                                Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                                className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                                onClick={() =>
                                    signOut({
                                        callbackUrl: "/",
                                    })
                                }
                            >
                                Log out
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
