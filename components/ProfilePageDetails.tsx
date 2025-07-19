"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

interface User {
    id: string;
    name: string | null;
    image: string | null;
    bio: string | null;
}

interface ProfilePageDetailsProps {
    user: User;
}

export default function ProfilePageDetails({ user }: ProfilePageDetailsProps) {
    const userInitials = user.name
        ? user.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)
        : "U";
    const userHandle =
        user.name
            ?.trim()
            .toLowerCase()
            .replace(/\s+/g, "_")
            .replace(/[^a-z0-9_]/g, "") || "retardeduser";

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/30 px-6 py-12">
            <div className="flex flex-col items-center space-y-8 max-w-lg text-center">
                <Avatar className="w-32 h-32 cursor-pointer shadow-lg">
                    <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "Retard"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-foreground">
                            {user.name || "Retard"}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <span className="text-sm font-semibold">
                                @{userHandle}
                            </span>
                        </div>
                    </div>
                    <p className="text-foreground text-base leading-relaxed max-w-md mx-auto">
                        {user.bio || "I am retarded"}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>Joined March 2024</span>
                    </div>
                    <p className="text-muted-foreground text-sm font-semibold">
                        1.2k followers • 342 likes • 21 images
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="shadow-sm cursor-pointer"
                    >
                        Share
                    </Button>
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                        Edit profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
