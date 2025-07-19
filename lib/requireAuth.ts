import { redirect } from "next/navigation";
import { getAuthSession } from "./authSession";

export async function requireAuth() {
    const session = await getAuthSession();
    if (!session) {
        redirect("/");
    }
    return session;
}
