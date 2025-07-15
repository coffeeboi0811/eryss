"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar } from "lucide-react";

export default function ProfilePageDetails() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 px-6 py-12">
            <div className="flex flex-col items-center space-y-8 max-w-lg text-center">
                <Avatar className="w-32 h-32 cursor-pointer shadow-lg">
                    <AvatarImage src="/image1.jpeg" alt="CoffeeBoi" />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-3xl">
                        C
                    </AvatarFallback>
                </Avatar>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold text-gray-900">
                            Retard
                        </h1>
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                            <span className="text-sm font-semibold">
                                @retarded101
                            </span>
                        </div>
                    </div>

                    <p className="text-gray-700 text-base leading-relaxed max-w-md mx-auto">
                        Digital artist passionate about creating aesthetic
                        visuals and inspiring creativity through art.
                    </p>

                    <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>Joined March 2024</span>
                    </div>

                    <p className="text-gray-500 text-sm font-semibold">
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
                    <Button className="bg-gray-900 hover:bg-gray-800 text-white cursor-pointer">
                        Edit profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
