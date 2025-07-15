import ProfilePageDetails from "@/components/ProfilePageDetails";
import { ResponsiveMasonryGrid } from "@/components/ResponsiveMasonryGrid";
import { ImagePostCard } from "@/components/ImagePostCard";
import { imagePosts } from "@/lib/imagePostsData";

function UserProfilePage() {
    return (
        <div>
            <ProfilePageDetails />
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

export default UserProfilePage;
