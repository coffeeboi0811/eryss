"use client";

import Masonry from "react-masonry-css";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import "@/components/masonry.css";

interface ResponsiveMasonryGridProps {
    children: ReactNode;
    className?: string;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

export const itemVariants = {
    hidden: {
        opacity: 0,
        y: 20,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: "easeOut" as const,
        },
    },
};

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
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <Masonry
                breakpointCols={breakpointColumnsObj}
                className={cn("masonry-grid", className)}
                columnClassName="masonry-grid_column"
            >
                {children}
            </Masonry>
        </motion.div>
    );
}
