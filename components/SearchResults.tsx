"use client";

import { motion } from "framer-motion";
import { UserSearchResult } from "@/components/UserSearchResult";

interface SearchResultsProps {
    users: Array<{
        id: string;
        name: string | null;
        image: string | null;
        bio: string | null;
        _count: {
            followers: number;
        };
    }>;
    userFollowStatuses: string[];
    query: string;
}

const resultsVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.03,
            delayChildren: 0.1,
        },
    },
};

const resultItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.3 },
    },
};

export function SearchResults({
    users,
    userFollowStatuses,
    query,
}: SearchResultsProps) {
    if (users.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">
                    No users found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-muted-foreground text-sm mt-2">
                    Try searching with different keywords
                </p>
            </div>
        );
    }

    return (
        <motion.div
            variants={resultsVariants}
            initial="hidden"
            animate="visible"
            className="bg-background rounded-lg flex flex-col gap-3"
        >
            {users.map((user) => (
                <motion.div key={user.id} variants={resultItemVariants}>
                    <UserSearchResult
                        avatarSrc={user.image || ""}
                        fullName={user.name || ""}
                        bio={user.bio || ""}
                        userId={user.id}
                        followersCount={user._count.followers}
                        initialFollowing={userFollowStatuses.includes(user.id)}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
