"use client";

import { Search, Home, Compass, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { useRouter } from "next/navigation";

export function Navbar() {
    const router = useRouter();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
            <div className="flex items-center justify-between px-4 py-0 h-full space-x-4">
                {/* left section */}
                <div className="flex items-center space-x-4 h-full">
                    <Link href="/" className="flex items-center h-full">
                        <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-lg">
                                E
                            </span>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center space-x-2 h-full">
                        <Link href="/">
                            <Button
                                variant="ghost"
                                className="font-semibold text-foreground hover:bg-accent rounded-full px-4 py-2 cursor-pointer flex items-center gap-2 h-10 flex-shrink-0"
                            >
                                <Home className="w-4 h-4 flex-shrink-0" />
                                Home
                            </Button>
                        </Link>
                        <Link href="/explore">
                            <Button
                                variant="ghost"
                                className="font-semibold text-muted-foreground hover:bg-accent rounded-full px-4 py-2 cursor-pointer flex items-center gap-2 h-10 flex-shrink-0"
                            >
                                <Compass className="w-4 h-4 flex-shrink-0" />
                                Explore
                            </Button>
                        </Link>
                        <Link href="/create">
                            <Button
                                variant="ghost"
                                className="font-semibold text-muted-foreground hover:bg-accent rounded-full px-4 py-2 cursor-pointer flex items-center gap-2 h-10 flex-shrink-0"
                            >
                                <Plus className="w-4 h-4 flex-shrink-0" />
                                Create
                            </Button>
                        </Link>
                    </div>
                </div>
                {/* center section */}
                <div className="flex-1 h-full flex items-center px-4">
                    <form
                        className="relative w-full"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = e.currentTarget.search.value.trim();
                            if (query) {
                                router.push(
                                    `/search?q=${encodeURIComponent(query)}`
                                );
                            }
                        }}
                    >
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 flex-shrink-0" />
                        <input
                            type="text"
                            name="search"
                            placeholder="Search for images, users..."
                            className="w-full pl-12 pr-4 py-3 bg-muted rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all duration-200 h-12 text-base"
                        />
                    </form>
                </div>
                {/* right section */}
                <div className="flex items-center h-full px-4">
                    <UserMenu />
                </div>
            </div>
            {/* mobile navigation */}
            <div className="md:hidden border-t border-border bg-background h-14">
                <div className="flex justify-around py-0 h-full">
                    <Link href="/" className="flex-1 h-full">
                        <Button
                            variant="ghost"
                            className="w-full h-full font-semibold text-foreground cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                        >
                            <Home className="w-4 h-4 flex-shrink-0" />
                            Home
                        </Button>
                    </Link>
                    <Link href="/explore" className="flex-1 h-full">
                        <Button
                            variant="ghost"
                            className="w-full h-full font-semibold text-muted-foreground cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                        >
                            <Compass className="w-4 h-4 flex-shrink-0" />
                            Explore
                        </Button>
                    </Link>
                    <Link href="/create" className="flex-1 h-full">
                        <Button
                            variant="ghost"
                            className="w-full h-full font-semibold text-muted-foreground cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
                        >
                            <Plus className="w-4 h-4 flex-shrink-0" />
                            Create
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
