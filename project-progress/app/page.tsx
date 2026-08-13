import Header from "@/components/Header";
import ProjectList from "@/components/ProjectList";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Header />
        <ProjectList />
      </div>
    </main>
  );
}