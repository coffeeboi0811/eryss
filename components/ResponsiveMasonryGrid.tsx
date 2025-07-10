"use client";

import Masonry from "react-masonry-css";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import "@/components/masonry.css";

interface ResponsiveMasonryGridProps {
    children: ReactNode;
    className?: string;
}

const breakpointColumnsObj = {
    default: 6,
    1536: 5,
    1280: 4,
    1024: 3,
    640: 2,
};

export function ResponsiveMasonryGrid({
    children,
    className,
}: ResponsiveMasonryGridProps) {
    return (
        <Masonry
            breakpointCols={breakpointColumnsObj}
            className={cn("masonry-grid", className)}
            columnClassName="masonry-grid_column"
        >
            {children}
        </Masonry>
    );
}
