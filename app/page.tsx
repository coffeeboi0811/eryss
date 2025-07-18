import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";
import { getAuthSession } from "@/lib/authSession";

export default async function Home() {
    const session = await getAuthSession();
    console.log(session);
    return (
        <main className="w-full px-4 py-8">
            <ResponsiveMasonryGrid>
                {imagePosts.map((post, i) => (
                    <ImagePostCard key={i} {...post} index={i} />
                ))}
            </ResponsiveMasonryGrid>
        </main>
    );
}
