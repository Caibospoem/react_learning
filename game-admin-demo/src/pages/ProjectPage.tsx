import { useMemo, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { mockProjects } from "../mock/data";
import type { ProjectStatus } from "../types";

function ProjectPage() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"全部" | ProjectStatus>("全部");

  const filteredProjects = useMemo(() => {
    return mockProjects.filter((project) => {
      const matchKeyword =
        project.name.includes(keyword) || project.description.includes(keyword);

      const matchStatus = status === "全部" ? true : project.status === status;

      return matchKeyword && matchStatus;
    });
  }, [keyword, status]);

  return (
    <div>
      <div className="page-header">
        <h1>项目管理</h1>
        <button className="btn primary">新建项目</button>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="搜索项目名或描述"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <select
          className="input"
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "全部" | ProjectStatus)
          }
        >
          <option value="全部">全部状态</option>
          <option value="进行中">进行中</option>
          <option value="已发布">已发布</option>
          <option value="已归档">已归档</option>
        </select>
      </div>

      <div className="card-grid">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))
        ) : (
          <div className="empty">没有找到符合条件的项目</div>
        )}
      </div>
    </div>
  );
}

export default ProjectPage;