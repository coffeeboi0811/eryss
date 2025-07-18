import ProfilePageDetails from "@/components/ProfilePageDetails";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

interface UserProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function UserProfilePage({
    params,
}: UserProfilePageProps) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: {
            id: id,
        },
        omit: {
            email: true,
            emailVerified: true,
        },
    });
    if (!user) {
        notFound();
    }
    return (
        <div>
            <ProfilePageDetails user={user} />
            <main className="w-full px-4 py-8">
                <ResponsiveMasonryGrid>
                    {imagePosts.map((post, i) => (
                        <ImagePostCard key={i} {...post} index={i} />
                    ))}
                </ResponsiveMasonryGrid>
            </main>
        </div>
    );
}
