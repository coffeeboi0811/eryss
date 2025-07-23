import React from "react";
import Image from "next/image";

export default function LoadingScreen() {
    return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-100">
            <div className="flex flex-col items-center space-y-6">
                <div className="flex items-center justify-center">
                    <Image
                        src="/logo.svg"
                        alt="Eryss Logo"
                        width={80}
                        height={80}
                        className="w-20 h-20 dark:invert"
                        priority
                    />
                </div>
                <div className="flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
                </div>
            </div>
        </div>
    );
}
