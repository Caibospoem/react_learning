import { mockTasks } from "../mock/data";
import StatusTag from "../components/StatusTag";

function TaskPage() {
  return (
    <div>
      <div className="page-header">
        <h1>任务中心</h1>
        <button className="btn primary">创建任务</button>
      </div>

      <div className="table">
        <div className="table-row table-head">
          <span>任务名称</span>
          <span>状态</span>
          <span>创建时间</span>
        </div>

        {mockTasks.map((task) => (
          <div key={task.id} className="table-row">
            <span>{task.name}</span>
            <span>
              <StatusTag text={task.status} />
            </span>
            <span>{task.createdAt}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskPage;