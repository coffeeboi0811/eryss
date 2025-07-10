"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface CatPostCardProps {
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
    className?: string;
}

export function CatPostCard({
    imageSrc,
    authorImg,
    authorName,
    className,
}: CatPostCardProps) {
    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl shadow-sm transition-all cursor-pointer w-full block break-inside-avoid mb-4",
                className
            )}
        >
            <Image
                src={imageSrc}
                alt="Cat image"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                <div className="p-3 flex items-end justify-between">
                    <Avatar className="w-8 h-8 border-2 border-white">
                        {authorImg ? (
                            <AvatarImage src={authorImg} alt={authorName} />
                        ) : (
                            <AvatarFallback className="bg-white/20 text-white text-xs">
                                {authorName?.[0] || "C"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                            <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-white/20 h-8 w-8 p-0"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
