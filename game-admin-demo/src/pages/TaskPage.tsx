import { useEffect, useState } from "react";
import { createStudioTaskApi, getStudioTasksApi } from "../services/taskApi";
import type { StudioTask, StudioTaskType } from "../types";
import { getActiveProjectId, PROJECT_CHANGED_EVENT } from "../utils/activeProject";

function TaskPage() {
  const [tasks, setTasks] = useState<StudioTask[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(getActiveProjectId());
  const [prompt, setPrompt] = useState("帮我生成一个 2D 横版关卡");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadTasks = async () => {
    if (!activeProjectId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const list = await getStudioTasksApi(activeProjectId);
      setTasks(list);
    } catch (error) {
      console.error(error);
      alert("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, [activeProjectId]);

  useEffect(() => {
    const timer = setInterval(() => {
      void loadTasks();
    }, 2000);
    return () => clearInterval(timer);
  }, [activeProjectId]);

  useEffect(() => {
    const onProjectChanged = () => setActiveProjectId(getActiveProjectId());
    window.addEventListener(PROJECT_CHANGED_EVENT, onProjectChanged as EventListener);
    return () =>
      window.removeEventListener(PROJECT_CHANGED_EVENT, onProjectChanged as EventListener);
  }, []);

  const handleCreateTask = async (taskType: StudioTaskType) => {
    if (!activeProjectId) {
      alert("Please select a project first.");
      return;
    }
    setSubmitting(true);
    try {
      await createStudioTaskApi({
        projectId: activeProjectId,
        taskType,
        prompt: taskType === "GENERATE_MAP" ? prompt : undefined,
      });
      await loadTasks();
    } catch (error) {
      console.error(error);
      alert("Create task failed.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>任务调度中心</h1>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Trigger Async Jobs</h2>
        </div>
        <div className="toolbar">
          <input
            className="input grow"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Prompt for map generation"
          />
          <button
            className="btn primary"
            onClick={() => void handleCreateTask("GENERATE_MAP")}
            disabled={submitting}
          >
            Generate Map
          </button>
          <button
            className="btn"
            onClick={() => void handleCreateTask("PACKAGE_BUILD")}
            disabled={submitting}
          >
            Package
          </button>
          <button
            className="btn"
            onClick={() => void handleCreateTask("PUBLISH_RELEASE")}
            disabled={submitting}
          >
            Publish
          </button>
        </div>
      </div>

      <div className="table">
        <div className="table-row table-head task-row">
          <span>ID</span>
          <span>Type</span>
          <span>Status</span>
          <span>Progress</span>
          <span>Updated</span>
          <span>Result/Error</span>
        </div>
        {tasks.map((task) => (
          <div key={task.id} className="table-row task-row">
            <span>{task.id}</span>
            <span>{task.task_type}</span>
            <span>{task.status}</span>
            <span>{task.progress}%</span>
            <span>{new Date(task.updated_at).toLocaleString()}</span>
            <span className="muted">
              {task.error
                ? task.error
                : task.result
                  ? JSON.stringify(task.result)
                  : "Running..."}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;

