import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { CatPostCard } from "@/components/CatPostCard";
import { catPosts } from "@/lib/catPostsData";

export default function Home() {
    return (
        <main className="w-full px-4 py-8">
            <ResponsiveMasonryGrid>
                {catPosts.map((post, i) => (
                    <CatPostCard key={i} {...post} />
                ))}
            </ResponsiveMasonryGrid>
        </main>
    );
}
