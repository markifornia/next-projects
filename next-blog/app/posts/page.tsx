import { createPost } from "@/actions/actions"
import { prisma } from "@/lib/prisma"
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import { Suspense } from "react";

const getPosts = async () =>{
  "use cache";
  cacheLife("days");
  cacheTag("posts");

  return await prisma.post.findMany();
}

export default async function PostsPage() {

  const posts = await getPosts();

  return (
          <div className="space-y-8">
            <section className="space-y-4">
              <h1 className="text-center text-4xl font-semibold text-zinc-950 sm:text-5xl">
                    Posts
              </h1>

              <ul className="space-y-3">
                {posts.slice(0, 10).map((post) => (
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

            <section className="space-y-4 border-t border-zinc-200 pt-6">
              <h2 className="text-xl font-semibold text-zinc-950">New post</h2>
              <form action={createPost} className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Title</span>
                  <input
                    name="title"
                    type="text"
                    required
                    className="h-10 w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-500"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-zinc-700">Content</span>
                  <textarea
                    name="content"
                    required
                    rows={5}
                    className="w-full rounded-md border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-950 outline-none transition-colors focus:border-zinc-500"
                  />
                </label>

                <button
                  type="submit"
                  className="rounded-md bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
                >
                  Create
                </button>
              </form>
            </section>

          </div>
  );
}
