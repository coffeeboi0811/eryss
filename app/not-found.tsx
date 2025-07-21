"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NotFound() {
    const router = useRouter();
    useEffect(() => {
        toast.error("Page not found - taking you home");

        const timeout = setTimeout(() => {
            router.replace("/"); // replace instead of push to avoid back button issues.
        }, 1500);

        return () => clearTimeout(timeout);
    }, [router]);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                <p className="text-muted-foreground">Redirecting...</p>
            </div>
        </>
    );
}
