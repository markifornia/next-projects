import { prisma } from "@/lib/prisma"
import Link from "next/link";

export default async function Home() {

  // const posts = await prisma.post.findMany();

  return (
          <div className="space-y-8">
            <section className="space-y-4">
              <h1 className="text-center text-4xl font-semibold text-zinc-950 sm:text-5xl">
                    Welcome to my Blog
              </h1>


            </section>
          </div>
  );
}
