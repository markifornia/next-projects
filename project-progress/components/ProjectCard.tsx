import { Project } from "@/types/project";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({
  project,
}: ProjectCardProps) {
  const completedMilestones = project.milestones.filter(
    (milestone) => milestone.completed
  ).length;

  const totalMilestones = project.milestones.length;

  const progress =
    totalMilestones === 0
      ? 0
      : Math.round(
          (completedMilestones / totalMilestones) * 100
        );

  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-lg shadow-black/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            {project.name}
          </h2>

          {project.client && (
            <p className="mt-1 text-sm text-slate-500">
              {project.client}
            </p>
          )}
        </div>

        <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
          {project.status}
        </span>
      </div>

      <p className="mt-4 leading-7 text-slate-400">
        {project.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {project.techStack.map((technology) => (
          <span
            key={technology}
            className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-medium text-slate-300"
          >
            {technology}
          </span>
        ))}
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium text-slate-300">
            Project progress
          </span>

          <span className="font-semibold text-white">
            {progress}%
          </span>
        </div>

        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-cyan-400 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-2 text-sm text-slate-500">
          {completedMilestones} of {totalMilestones} milestones completed
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
          Milestones
        </h3>

        <ul className="mt-3 space-y-2">
          {project.milestones.map((milestone) => (
            <li
              key={milestone.id}
              className="flex items-center gap-3 text-sm"
            >
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                  milestone.completed
                    ? "border-cyan-400 bg-cyan-400 text-slate-950"
                    : "border-slate-600 text-transparent"
                }`}
              >
                ✓
              </span>

              <span
                className={
                  milestone.completed
                    ? "text-slate-500 line-through"
                    : "text-slate-300"
                }
              >
                {milestone.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}