import { notFound } from 'next/navigation';
import { prisma } from "@/lib/prisma"
import RecentlyViewedPosts from '@/components/recently-viewed-posts';
import { Suspense } from 'react';
import { getPosts } from '@/lib/utils';

// type PostPageProps = {
//   params: Promise<{ id: string }>;
// }

// export default async function PostPage({ params }: PostPageProps) {
  // const { id } = await params;

  // const post = await prisma.post.findUnique({
  //   where: {
  //     id: Number(id),
  //   },
  // });

export default async function PostPage() {
  // const cookieStore = cookies();

  const posts = await getPosts();

  if (!posts) {
    notFound();
  }

  // await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <article className="space-y-6">
        <div className="space-y-4">
            <h1 className="text-center text-4xl font-semibold text-zinc-950 sm:text-5xl">
                Posts
            </h1>
            <Suspense fallback={<p>Loading recently viewed posts...</p>}>
                <RecentlyViewedPosts />
            </Suspense>
        </div>
    </article>
  );
}