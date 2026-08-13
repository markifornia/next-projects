import ProjectCard from "@/components/ProjectCard";
import { Project } from "@/types/project";

const projects: Project[] = [
  {
    id: "portfolio-website",
    name: "Developer Portfolio",
    description:
      "A polished portfolio website showcasing development projects, technical skills, and professional experience.",
    techStack: ["WordPress", "PHP", "JavaScript", "CSS"],
    client: "Personal Project",
    milestones: [
      {
        id: "portfolio-design",
        title: "Complete the visual design",
        completed: true,
      },
      {
        id: "portfolio-projects",
        title: "Add featured projects",
        completed: true,
      },
      {
        id: "portfolio-performance",
        title: "Improve site performance",
        completed: true,
      },
      {
        id: "portfolio-launch",
        title: "Launch the website",
        completed: false,
      },
    ],
    status: "In Progress",
    githubUrl: "",
    liveUrl: "",
    dueDate: "2026-08-31",
  },
  {
    id: "shipboard",
    name: "ShipBoard",
    description:
      "A developer dashboard for managing projects, tracking milestones, and monitoring progress toward deployment.",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    milestones: [
      {
        id: "shipboard-setup",
        title: "Set up the Next.js project",
        completed: true,
      },
      {
        id: "shipboard-components",
        title: "Create reusable components",
        completed: true,
      },
      {
        id: "shipboard-state",
        title: "Add project state management",
        completed: false,
      },
      {
        id: "shipboard-storage",
        title: "Save projects in local storage",
        completed: false,
      },
      {
        id: "shipboard-deploy",
        title: "Deploy to Vercel",
        completed: false,
      },
    ],
    status: "In Progress",
    githubUrl: "https://github.com/markifornia/project-progress",
    liveUrl: "",
  },
];

export default function ProjectList() {
  return (
    <section className="mt-10">
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}