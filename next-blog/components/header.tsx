import Image from "next/image";
import Link from "next/link";


export default function Header() {
    return (
            <header className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 sm:px-6">
            
              <Link href="/" className="flex items-center gap-3 font-semibold">
                <Image
                src="/next.svg"
                alt="Logo"
                width={120}
                height={40}
                />
              </Link>

              <nav className="flex items-center gap-4 text-sm font-medium text-zinc-600">
                <Link href="/" className="hover:text-zinc-950">
                  Home
                </Link>
                <Link href="/posts" className="hover:text-zinc-950">
                  Posts
                </Link>
              </nav>
            </header>
    );
}
