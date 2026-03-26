import { useEffect, useState } from "react";
import StatusTag from "../components/StatusTag";
import { createTaskApi, getTasksApi } from "../services/taskApi";
import type { Task } from "../types";

function TaskPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const data = await getTasksApi();
      setTasks(data);
    } catch (error) {
      console.error(error);
      alert("获取任务列表失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async () => {
    try {
      await createTaskApi({ name: "打包 Web 试玩版" });
      alert("任务已创建");
      fetchTasks();
    } catch (error) {
      console.error(error);
      alert("创建任务失败");
    }
  };

  if (loading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>任务中心</h1>
        <button className="btn primary" onClick={handleCreateTask}>
          创建任务
        </button>
      </div>

      <div className="table">
        <div className="table-row table-head">
          <span>任务名称</span>
          <span>状态</span>
          <span>创建时间</span>
        </div>

        {tasks.map((task) => (
          <div key={task.id} className="table-row">
            <span>{task.name}</span>
            <span>
              <StatusTag text={task.status} />
            </span>
            <span>{task.createdAt ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;