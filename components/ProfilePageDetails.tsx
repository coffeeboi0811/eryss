"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfilePageDetails() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] bg-gray-50 px-6 py-12">
            <div className="flex flex-col items-center space-y-6 max-w-md text-center">
                <Avatar className="w-32 h-32 cursor-pointer shadow-lg">
                    <AvatarImage src="/image1.jpeg" alt="CoffeeBoi" />
                    <AvatarFallback className="bg-gray-200 text-gray-600 text-3xl">
                        C
                    </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-gray-900">Retard</h1>
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-sm">@retarded101</span>
                    </div>
                    <p className="text-gray-500 text-sm">0 following</p>
                </div>
                <div className="flex gap-3 mt-4">
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
