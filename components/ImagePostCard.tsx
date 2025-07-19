"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Bookmark, Download } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface ImagePostCardProps {
    imageSrc: string;
    authorImg?: string;
    authorName?: string;
    className?: string;
    index?: string;
}

export function ImagePostCard({
    imageSrc,
    authorImg,
    authorName,
    className,
    index,
}: ImagePostCardProps) {
    const router = useRouter();

    const handleImageClick = () => {
        if (index !== undefined) {
            window.scrollTo(0, 0); // force scroll to top before navigation
            router.push(`/image/${index}`);
        }
    };

    return (
        <div
            className={cn(
                "group relative overflow-hidden rounded-2xl shadow-sm transition-all cursor-zoom-in w-full block break-inside-avoid mb-4",
                className
            )}
            onClick={handleImageClick}
        >
            <Image
                src={imageSrc}
                alt="Image"
                width={300}
                height={400}
                className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end">
                <div className="p-3 flex items-end justify-between">
                    <Avatar className="w-8 h-8 border-2 border-white cursor-pointer">
                        {authorImg ? (
                            <AvatarImage src={authorImg} alt={authorName} />
                        ) : (
                            <AvatarFallback className="bg-white/20 text-white text-xs">
                                {authorName?.[0] || "A"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="flex gap-1">
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-red-500/30 hover:text-red-400 h-8 w-8 p-0 cursor-pointer transition-all duration-200"
                        >
                            <Heart className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-blue-500/30 hover:text-blue-400 h-8 w-8 p-0 cursor-pointer transition-all duration-200"
                        >
                            <Bookmark className="w-4 h-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-white hover:bg-green-500/30 hover:text-green-400 h-8 w-8 p-0 cursor-pointer transition-all duration-200"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
