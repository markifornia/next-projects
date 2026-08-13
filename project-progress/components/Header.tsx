export default function Header() {
  return (
    <header className="border-b border-slate-800 pb-8">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
        Developer Project Dashboard
      </p>

      <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        ShipBoard
      </h1>

      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">
        Plan the work, track every milestone, and move your development
        projects toward launch.
      </p>
    </header>
  );
}