import { useEffect, useMemo, useState } from "react";
import { getProjectsApi } from "../services/projectApi";
import type { Project } from "../types";
import {
  getActiveProjectId,
  PROJECT_CHANGED_EVENT,
  PROJECT_LIST_CHANGED_EVENT,
  setActiveProjectId,
} from "../utils/activeProject";

function ProjectSwitcher() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveId] = useState<number | null>(getActiveProjectId());

  const loadProjects = async () => {
    try {
      const list = await getProjectsApi();
      setProjects(list);
      const currentActiveId = getActiveProjectId();
      if (list.length === 0) {
        setActiveProjectId(null);
        setActiveId(null);
        return;
      }
      if (!currentActiveId || !list.some((project) => project.id === currentActiveId)) {
        setActiveProjectId(list[0].id);
        setActiveId(list[0].id);
        return;
      }
      setActiveId(currentActiveId);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    const listener = () => {
      setActiveId(getActiveProjectId());
    };
    const listListener = () => {
      void loadProjects();
    };
    window.addEventListener(PROJECT_CHANGED_EVENT, listener as EventListener);
    window.addEventListener(PROJECT_LIST_CHANGED_EVENT, listListener as EventListener);
    return () => {
      window.removeEventListener(PROJECT_CHANGED_EVENT, listener as EventListener);
      window.removeEventListener(PROJECT_LIST_CHANGED_EVENT, listListener as EventListener);
    };
  }, []);

  const projectName = useMemo(() => {
    const target = projects.find((item) => item.id === activeProjectId);
    return target ? target.name : "Not selected";
  }, [activeProjectId, projects]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextValue = event.target.value;
    if (!nextValue) {
      setActiveProjectId(null);
      return;
    }
    setActiveProjectId(Number(nextValue));
  };

  return (
    <div className="project-switcher">
      <span className="muted">Project</span>
      <select className="input" value={activeProjectId ?? ""} onChange={handleChange}>
        <option value="">Select</option>
        {projects.map((project) => (
          <option key={project.id} value={project.id}>
            {project.name}
          </option>
        ))}
      </select>
      <span className="muted">Current: {projectName}</span>
    </div>
  );
}

export default ProjectSwitcher;
