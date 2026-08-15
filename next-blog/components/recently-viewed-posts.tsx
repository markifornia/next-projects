import { cookies } from "next/headers";

export default async function RecentlyViewedPosts() {
    const cookieStore = await cookies();

    return (
        <div>
            <h2>Recently Viewed Posts</h2>
            <ul></ul>
        </div>
    )
}