import CreateImage from "@/components/CreateImage";
import { requireAuth } from "@/lib/requireAuth";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create • Eryss",
    description: "Share your visual creations with the world",
    openGraph: {
        title: "Create • Eryss",
        description: "Share your visual creations with the world",
        images: ["/og-default.png"],
    },
};

export default async function CreateImagePage() {
    await requireAuth();
    return (
        <div className="bg-background">
            <CreateImage />
        </div>
    );
}
