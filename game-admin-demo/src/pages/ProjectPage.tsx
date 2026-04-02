import { useEffect, useMemo, useState } from "react";
import {
  cloneProjectApi,
  createProjectApi,
  deleteProjectApi,
  getProjectsApi,
  updateProjectStatusApi,
} from "../services/projectApi";
import type { Project } from "../types";
import {
  getActiveProjectId,
  notifyProjectListChanged,
  PROJECT_CHANGED_EVENT,
  setActiveProjectId,
} from "../utils/activeProject";

function ProjectPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [keyword, setKeyword] = useState("");
  const [activeProjectId, setProjectId] = useState<number | null>(getActiveProjectId());
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const username = localStorage.getItem("username") ?? "bocai";

  const loadProjects = async () => {
    setLoading(true);
    try {
      const list = await getProjectsApi();
      setProjects(list);
      const currentActiveId = getActiveProjectId();
      if (list.length === 0) {
        setActiveProjectId(null);
      } else if (!currentActiveId || !list.some((project) => project.id === currentActiveId)) {
        setActiveProjectId(list[0].id);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProjects();
  }, []);

  useEffect(() => {
    const onProjectChange = () => setProjectId(getActiveProjectId());
    window.addEventListener(PROJECT_CHANGED_EVENT, onProjectChange as EventListener);
    return () => window.removeEventListener(PROJECT_CHANGED_EVENT, onProjectChange as EventListener);
  }, []);

  const filteredProjects = useMemo(
    () =>
      projects.filter((project) => {
        if (!keyword.trim()) {
          return true;
        }
        return (
          project.name.toLowerCase().includes(keyword.toLowerCase()) ||
          project.description.toLowerCase().includes(keyword.toLowerCase())
        );
      }),
    [keyword, projects],
  );

  const handleCreate = async () => {
    if (!newName.trim()) {
      return;
    }
    try {
      await createProjectApi({
        name: newName.trim(),
        description: newDescription.trim(),
        owner: username,
      });
      setNewName("");
      setNewDescription("");
      await loadProjects();
      notifyProjectListChanged();
    } catch (error) {
      console.error(error);
      alert("Failed to create project.");
    }
  };

  const handleClone = async (project: Project) => {
    try {
      await cloneProjectApi(project.id, `${project.name} Copy`);
      await loadProjects();
      notifyProjectListChanged();
    } catch (error) {
      console.error(error);
      alert("Failed to clone project.");
    }
  };

  const handlePublish = async (project: Project) => {
    try {
      const isPublished = project.status.includes("已发布");
      await updateProjectStatusApi(project.id, isPublished ? "IN_PROGRESS" : "PUBLISHED");
      await loadProjects();
    } catch (error) {
      console.error(error);
      alert("Failed to update project status.");
    }
  };

  const handleDelete = async (project: Project) => {
    const shouldDelete = window.confirm(
      `Delete project "${project.name}"?\nThis will remove related assets, versions and tasks.`,
    );
    if (!shouldDelete) {
      return;
    }
    try {
      await deleteProjectApi(project.id);
      const remainProjects = projects.filter((item) => item.id !== project.id);
      if (activeProjectId === project.id) {
        setActiveProjectId(remainProjects[0]?.id ?? null);
      }
      await loadProjects();
      notifyProjectListChanged();
    } catch (error) {
      console.error(error);
      alert("Failed to delete project.");
    }
  };

  if (loading) {
    return <div>Loading projects...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Project Management</h1>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Create Project</h2>
        </div>
        <div className="form-grid">
          <input
            className="input"
            placeholder="Project name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
          <input
            className="input"
            placeholder="Description"
            value={newDescription}
            onChange={(event) => setNewDescription(event.target.value)}
          />
          <button className="btn primary" onClick={handleCreate}>
            Create
          </button>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search project"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>

      <div className="table">
        <div className="table-row table-head project-row">
          <span>Name</span>
          <span>Description</span>
          <span>Status</span>
          <span>Owner</span>
          <span>Actions</span>
        </div>
        {filteredProjects.map((project) => (
          <div key={project.id} className="table-row project-row">
            <span>{project.name}</span>
            <span>{project.description}</span>
            <span>{project.status}</span>
            <span>{project.owner}</span>
            <span className="table-actions">
              <button
                className={activeProjectId === project.id ? "btn primary" : "btn"}
                onClick={() => setActiveProjectId(project.id)}
              >
                {activeProjectId === project.id ? "Active" : "Set Active"}
              </button>
              <button className="btn" onClick={() => void handleClone(project)}>
                Clone
              </button>
              <button className="btn" onClick={() => void handlePublish(project)}>
                Publish Toggle
              </button>
              <button className="btn danger" onClick={() => void handleDelete(project)}>
                Delete
              </button>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProjectPage;

