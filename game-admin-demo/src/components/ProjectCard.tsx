import type { Project } from "../types";
import StatusTag from "./StatusTag";

type ProjectCardProps = {
  project: Project;
};

function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className="card">
      <div className="card-header">
        <h3>{project.name}</h3>
        <StatusTag text={project.status} />
      </div>
      <p className="muted">{project.description}</p>
      <div className="card-footer">
        <span>负责人：{project.owner}</span>
      </div>
    </div>
  );
}

export default ProjectCard;