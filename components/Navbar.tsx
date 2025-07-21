"use client";

import { Search, Home, Compass, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { UserMenu } from "./UserMenu";
import { useRouter, usePathname } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { GoogleIcon } from "./icons/GoogleIcon";
import Image from "next/image";

export function Navbar() {
    const router = useRouter();
    const pathname = usePathname();

    const { data: session, status } = useSession();

    const handleLogin = () => {
        signIn("google");
    };

    return (
        <>
            {/* desktop navbar */}
            <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
                <div className="flex items-center justify-between px-4 py-0 h-full space-x-4">
                    {/* left section */}
                    <div className="flex items-center space-x-4 h-full">
                        <Link href="/" className="flex items-center h-full">
                            <div className="flex items-center justify-center flex-shrink-0">
                                <Image
                                    src="/logo.svg"
                                    alt="Eryss Logo"
                                    width={64}
                                    height={64}
                                    className="w-16 h-16 dark:invert"
                                />
                            </div>
                        </Link>
                        <div className="flex items-center space-x-2 h-full">
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
                                const query =
                                    e.currentTarget.search.value.trim();
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
                        {status === "loading" ? (
                            <Skeleton className="h-10 w-10 rounded-full" />
                        ) : session ? (
                            <UserMenu session={session} />
                        ) : (
                            <Button
                                onClick={handleLogin}
                                variant="outline"
                                className="group border border-input/60 dark:border-input/40 bg-background hover:bg-accent/70 transition-colors duration-150 text-foreground font-medium rounded-full px-6 py-2 cursor-pointer flex items-center gap-2 shadow-sm focus-visible:ring-2 focus-visible:ring-ring/60"
                            >
                                <span className="flex items-center gap-2">
                                    <GoogleIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                    <span className="hidden sm:inline">
                                        Login with Google
                                    </span>
                                    <span className="inline sm:hidden">
                                        Login
                                    </span>
                                </span>
                            </Button>
                        )}
                    </div>
                </div>
            </nav>
            {/* mobile navbar */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background border-b border-border h-16">
                <div className="flex items-center justify-between px-4 py-0 h-full">
                    <Link href="/" className="flex items-center h-full">
                        <div className="flex items-center justify-center flex-shrink-0">
                            <Image
                                src="/logo.svg"
                                alt="Eryss Logo"
                                width={32}
                                height={32}
                                className="w-8 h-8 dark:invert"
                            />
                        </div>
                    </Link>

                    <div className="flex-1 h-full flex items-center px-2">
                        <form
                            className="relative w-full"
                            onSubmit={(e) => {
                                e.preventDefault();
                                const query =
                                    e.currentTarget.search.value.trim();
                                if (query) {
                                    router.push(
                                        `/search?q=${encodeURIComponent(query)}`
                                    );
                                }
                            }}
                        >
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 flex-shrink-0" />
                            <input
                                type="text"
                                name="search"
                                placeholder="Search..."
                                className="w-full pl-10 pr-3 py-2 bg-muted rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all duration-200 h-9 text-sm"
                            />
                        </form>
                    </div>
                    <div className="flex items-center h-full">
                        {status === "loading" ? (
                            <Skeleton className="h-8 w-8 rounded-full" />
                        ) : session ? (
                            <UserMenu session={session} />
                        ) : (
                            <Button
                                onClick={handleLogin}
                                size="sm"
                                variant="outline"
                                className="group border border-input/60 dark:border-input/40 bg-background hover:bg-accent/70 transition-colors duration-150 text-foreground font-medium rounded-full px-4 py-1 cursor-pointer text-xs flex items-center gap-1 shadow-sm focus-visible:ring-2 focus-visible:ring-ring/60"
                            >
                                <GoogleIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                Login
                            </Button>
                        )}
                    </div>
                </div>
            </nav>
            {/* mobile navigation bottom */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background h-16">
                <div className="flex justify-around py-0 h-full">
                    <Link href="/" className="flex-1 h-full">
                        <Button
                            variant="ghost"
                            className={`w-full h-full font-semibold cursor-pointer flex flex-col items-center justify-center gap-1 flex-shrink-0 ${
                                pathname === "/"
                                    ? "text-foreground bg-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                        >
                            <Home className="w-5 h-5 flex-shrink-0" />
                            <span className="text-xs">Home</span>
                        </Button>
                    </Link>
                    <Link href="/explore" className="flex-1 h-full">
                        <Button
                            variant="ghost"
                            className={`w-full h-full font-semibold cursor-pointer flex flex-col items-center justify-center gap-1 flex-shrink-0 ${
                                pathname === "/explore"
                                    ? "text-foreground bg-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                        >
                            <Compass className="w-5 h-5 flex-shrink-0" />
                            <span className="text-xs">Explore</span>
                        </Button>
                    </Link>
                    <Link href="/create" className="flex-1 h-full">
                        <Button
                            variant="ghost"
                            className={`w-full h-full font-semibold cursor-pointer flex flex-col items-center justify-center gap-1 flex-shrink-0 ${
                                pathname === "/create"
                                    ? "text-foreground bg-accent"
                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                            }`}
                        >
                            <Plus className="w-5 h-5 flex-shrink-0" />
                            <span className="text-xs">Create</span>
                        </Button>
                    </Link>
                </div>
            </nav>
        </>
    );
}
