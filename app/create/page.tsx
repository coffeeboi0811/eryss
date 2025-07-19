import CreateImage from "@/components/CreateImage";
import { requireAuth } from "@/lib/requireAuth";

export default async function CreateImagePage() {
    await requireAuth();
    return (
        <div className="bg-background">
            <CreateImage />
        </div>
    );
}
