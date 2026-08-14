import { prisma } from "@/lib/prisma"
import Link from "next/link";

export default async function Home() {
  const posts = await prisma.post.findMany();

  return (
          <div className="space-y-8">
            <section className="space-y-4">
              <h1 className="text-center text-4xl font-semibold text-zinc-950 sm:text-5xl">
                    Posts
              </h1>

              <ul className="space-y-3">
                {posts.slice(0, 5).map((post) => (
                  <li key={post.id}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <Link href={`/posts/${post.id}`} className="text-lg font-semibold text-zinc-950 hover:text">
                        {post.title.charAt(0).toUpperCase() + post.title.slice(1)}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>

            </section>
          </div>
  );
}
