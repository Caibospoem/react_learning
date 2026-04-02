import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapPreviewCanvas from "../components/MapPreviewCanvas";
import { getProjectsApi } from "../services/projectApi";
import { getRuntimeApi } from "../services/systemApi";
import { getStudioVersionsApi } from "../services/studioApi";
import { createGenerateTaskApi, getStudioTaskDetailApi, getStudioTasksApi } from "../services/taskApi";
import type { Project, StudioTask, StudioVersion } from "../types";
import { getActiveProjectId, PROJECT_CHANGED_EVENT, setActiveProjectId } from "../utils/activeProject";
import { setMapEditorImportPayload } from "../utils/mapEditorBridge";

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

function StudioPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setProjectId] = useState<number | null>(getActiveProjectId());
  const [prompt, setPrompt] = useState("帮我生成一个 2D 横版关卡");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [versions, setVersions] = useState<StudioVersion[]>([]);
  const [tasks, setTasks] = useState<StudioTask[]>([]);
  const [runtimeMode, setRuntimeMode] = useState("mock");
  const [running, setRunning] = useState(false);

  const activeProject = useMemo(
    () => projects.find((item) => item.id === activeProjectId) ?? null,
    [activeProjectId, projects],
  );
  const latestVersion = versions[0] ?? null;

  const loadProjects = async () => {
    const list = await getProjectsApi();
    setProjects(list);
    if (list.length === 0) {
      setActiveProjectId(null);
      return;
    }
    const currentActiveId = getActiveProjectId();
    if (!currentActiveId || !list.some((item) => item.id === currentActiveId)) {
      setActiveProjectId(list[0].id);
    }
  };

  const loadProjectData = async (projectId: number) => {
    const [versionList, taskList] = await Promise.all([
      getStudioVersionsApi(projectId),
      getStudioTasksApi(projectId),
    ]);
    setVersions(versionList);
    setTasks(taskList);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const [runtime] = await Promise.all([getRuntimeApi(), loadProjects()]);
        setRuntimeMode(runtime.ai_mode);
      } catch (error) {
        console.error(error);
      }
    };
    void bootstrap();
  }, []);

  useEffect(() => {
    const onProjectChange = () => setProjectId(getActiveProjectId());
    window.addEventListener(PROJECT_CHANGED_EVENT, onProjectChange as EventListener);
    return () => window.removeEventListener(PROJECT_CHANGED_EVENT, onProjectChange as EventListener);
  }, []);

  useEffect(() => {
    if (!activeProjectId) {
      setVersions([]);
      setTasks([]);
      return;
    }
    void loadProjectData(activeProjectId);
  }, [activeProjectId]);

  const pollTask = async (taskId: number) => {
    for (let index = 0; index < 60; index += 1) {
      const task = await getStudioTaskDetailApi(taskId);
      setTasks((previous) => {
        const next = previous.filter((item) => item.id !== task.id);
        return [task, ...next];
      });
      if (task.status === "SUCCESS" || task.status === "FAILED") {
        return task;
      }
      await sleep(1000);
    }
    return null;
  };

  const handleGenerate = async () => {
    if (!activeProjectId) {
      alert("Please select a project first.");
      return;
    }
    if (!prompt.trim()) {
      return;
    }
    setRunning(true);
    setMessages((previous) => [
      ...previous,
      { id: crypto.randomUUID(), role: "user", content: prompt.trim() },
    ]);

    try {
      const task = await createGenerateTaskApi(activeProjectId, prompt.trim());
      setTasks((previous) => [task, ...previous]);
      const finalTask = await pollTask(task.id);
      if (!finalTask || finalTask.status !== "SUCCESS") {
        setMessages((previous) => [
          ...previous,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Generation failed or timed out.",
          },
        ]);
        return;
      }
      await loadProjectData(activeProjectId);
      const summary = String(finalTask.result?.summary ?? "Map generated.");
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "assistant", content: summary },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((previous) => [
        ...previous,
        { id: crypto.randomUUID(), role: "assistant", content: "Generation request failed." },
      ]);
    } finally {
      setRunning(false);
    }
  };

  const handleEditInMapEditor = () => {
    if (!activeProjectId || !latestVersion) {
      return;
    }
    setMapEditorImportPayload({
      mapData: {
        rows: latestVersion.map_data.rows,
        cols: latestVersion.map_data.cols,
        tileSize: latestVersion.map_data.tileSize,
        cells: latestVersion.map_data.cells,
      },
      source: {
        projectId: activeProjectId,
        versionId: latestVersion.id,
        prompt: latestVersion.prompt,
      },
    });
    navigate("/mapeditor");
  };

  return (
    <div className="studio-grid">
      <section className="panel">
        <div className="panel-header">
          <h1>AI Creation Studio</h1>
          <span className="muted">
            {activeProject ? `Project: ${activeProject.name}` : "Select a project in top bar"}
          </span>
        </div>
        <p className="muted">Current mode: {runtimeMode} (no AI API key required)</p>

        <div className="chat-box">
          {messages.length === 0 ? (
            <div className="muted">输入创作需求，例如“帮我生成一个 2D 横版关卡”。</div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={message.role === "user" ? "chat-item user" : "chat-item assistant"}
              >
                <strong>{message.role === "user" ? "You" : "AI"}</strong>
                <p>{message.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="prompt-row">
          <input
            className="input grow"
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Describe the level you want to generate"
          />
          <button className="btn primary" onClick={handleGenerate} disabled={running}>
            {running ? "Generating..." : "Generate"}
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Online Preview</h2>
          <span className="muted">{latestVersion ? `Version #${latestVersion.id}` : "No version"}</span>
        </div>
        <MapPreviewCanvas mapData={latestVersion?.map_data ?? null} />
        <div className="toolbar" style={{ marginTop: 12 }}>
          <button
            className="btn"
            disabled={!latestVersion}
            onClick={handleEditInMapEditor}
            title={latestVersion ? "Open this generated map in editor" : "Generate map first"}
          >
            Edit Latest Generated Map
          </button>
        </div>
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Generated Assets</h2>
        </div>
        {latestVersion?.asset_manifest?.length ? (
          <div className="table compact">
            <div className="table-row table-head three-col">
              <span>Name</span>
              <span>Type</span>
              <span>Usage</span>
            </div>
            {latestVersion.asset_manifest.map((asset) => (
              <div key={`${asset.name}-${asset.usage}`} className="table-row three-col">
                <span>{asset.name}</span>
                <span>{asset.type}</span>
                <span>{asset.usage}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty">No generated asset manifest yet.</div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Version History</h2>
        </div>
        {versions.length === 0 ? (
          <div className="empty">No versions.</div>
        ) : (
          <div className="version-list">
            {versions.map((version) => (
              <div key={version.id} className="version-item">
                <div className="version-title">
                  <strong>V{version.id}</strong>
                  <span className="muted">{new Date(version.created_at).toLocaleString()}</span>
                </div>
                <p className="muted">{version.prompt}</p>
                <p>{version.summary}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Task History</h2>
        </div>
        {tasks.length === 0 ? (
          <div className="empty">No task history.</div>
        ) : (
          <div className="table compact">
            <div className="table-row table-head task-row">
              <span>ID</span>
              <span>Type</span>
              <span>Status</span>
              <span>Progress</span>
              <span>Updated</span>
              <span>Result</span>
            </div>
            {tasks.slice(0, 6).map((task) => (
              <div key={task.id} className="table-row task-row">
                <span>{task.id}</span>
                <span>{task.task_type}</span>
                <span>{task.status}</span>
                <span>{task.progress}%</span>
                <span>{new Date(task.updated_at).toLocaleString()}</span>
                <span className="muted">
                  {task.error ? task.error : task.result ? "Ready" : "Running"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default StudioPage;

