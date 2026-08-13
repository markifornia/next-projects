export type ProjectStatus = 
    | "Planning"
    | "In Progress"
    | "On Hold"
    | "Compeleted";

export type Milestone = {
    id: string;
    title: string;
    completed: boolean;
}

export type Project = {
    id: string;
    name: string;
    description: string;
    techStack: string[];
    client?: string;
    milestones: Milestone[];
    status: ProjectStatus;
    githubUrl?: string;
    liveUrl?: string;
    dueDate?: string;
}

