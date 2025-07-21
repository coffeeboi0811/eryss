"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import { useSession } from "next-auth/react";

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
    const { data: session } = useSession();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editedName, setEditedName] = useState(user.name || "");
    const [editedBio, setEditedBio] = useState(user.bio || "");
    const [nameError, setNameError] = useState("");
    const [bioError, setBioError] = useState("");

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
            .replace(/[^a-z0-9_]/g, "") || "user";

    const validateForm = () => {
        let isValid = true;

        if (editedName.trim().length < 3) {
            setNameError("Username must be at least 3 characters long");
            isValid = false;
        } else if (editedName.trim().length > 20) {
            setNameError("Username must be less than 20 characters");
            isValid = false;
        } else {
            setNameError("");
        }

        if (editedBio.length > 160) {
            setBioError("Bio must be less than 160 characters");
            isValid = false;
        } else {
            setBioError("");
        }

        return isValid;
    };

    const handleUpdate = () => {
        if (validateForm()) {
            console.log("Updated profile data:", {
                name: editedName.trim(),
                bio: editedBio,
            });
            setIsDialogOpen(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-muted/30 px-6 py-12">
            <div className="flex flex-col items-center space-y-8 max-w-lg text-center">
                <Avatar className="w-32 h-32 cursor-pointer shadow-lg">
                    <AvatarImage
                        src={user.image || ""}
                        alt={user.name || "User Avatar"}
                    />
                    <AvatarFallback className="bg-muted text-muted-foreground text-3xl">
                        {userInitials}
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-foreground">
                            {user.name || "Unknown User"}
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                            <span className="text-sm font-semibold">
                                @{userHandle}
                            </span>
                        </div>
                    </div>
                    <p className="text-foreground text-base leading-relaxed max-w-md mx-auto">
                        {user.bio || "No bio available"}
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
                    {session?.user.id === user.id ? (
                        <Dialog
                            open={isDialogOpen}
                            onOpenChange={setIsDialogOpen}
                        >
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                                    Edit profile
                                </Button>
                            </DialogTrigger>
                            <DialogContent
                                className="sm:max-w-[425px]"
                                onPointerDownOutside={(e) => e.preventDefault()}
                                onEscapeKeyDown={(e) => e.preventDefault()}
                            >
                                <DialogHeader>
                                    <DialogTitle>Edit profile</DialogTitle>
                                    <DialogDescription>
                                        Make changes to your profile here. Click
                                        update when you&apos;re done.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium"
                                        >
                                            Username
                                        </label>
                                        <Input
                                            id="name"
                                            value={editedName}
                                            onChange={(e) => {
                                                setEditedName(e.target.value);
                                                setNameError("");
                                            }}
                                            placeholder="Enter your username"
                                            className={
                                                nameError
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {nameError && (
                                            <p className="text-sm text-red-500">
                                                {nameError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid gap-2">
                                        <label
                                            htmlFor="bio"
                                            className="text-sm font-medium"
                                        >
                                            Bio{" "}
                                            <span className="text-muted-foreground">
                                                (optional)
                                            </span>
                                        </label>
                                        <Textarea
                                            id="bio"
                                            value={editedBio}
                                            onChange={(e) => {
                                                setEditedBio(e.target.value);
                                                setBioError("");
                                            }}
                                            placeholder="Tell us about yourself"
                                            rows={5}
                                            className={`resize-none ${
                                                bioError ? "border-red-500" : ""
                                            }`}
                                        />
                                        <div className="flex justify-between items-center">
                                            {bioError && (
                                                <p className="text-sm text-red-500">
                                                    {bioError}
                                                </p>
                                            )}
                                            <p className="text-sm text-muted-foreground ml-auto">
                                                {editedBio.length}/160
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        className="cursor-pointer"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleUpdate}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
                                    >
                                        Update
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    ) : (
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                            Follow
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
