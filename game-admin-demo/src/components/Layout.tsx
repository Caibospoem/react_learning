import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getRuntimeApi } from "../services/systemApi";
import ProjectSwitcher from "./ProjectSwitcher";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = localStorage.getItem("username") ?? "bocai";
  const [runtimeMode, setRuntimeMode] = useState("...");

  const menuList = [
    { path: "/studio", label: "AI Studio" },
    { path: "/projects", label: "Project Management" },
    { path: "/assets", label: "Asset Management" },
    { path: "/tasks", label: "Task Scheduler" },
    { path: "/mapeditor", label: "Map Editor" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("activeProjectId");
    navigate("/login");
  };

  useEffect(() => {
    const loadRuntime = async () => {
      try {
        const runtime = await getRuntimeApi();
        setRuntimeMode(runtime.ai_mode);
      } catch (error) {
        console.error(error);
        setRuntimeMode("unknown");
      }
    };
    void loadRuntime();
  }, []);

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="logo">AI Game Studio</h2>
        <nav className="menu">
          {menuList.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? "menu-item active" : "menu-item"}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <ProjectSwitcher />
          <div className="topbar-actions">
            <span className="status-tag">AI Mode: {runtimeMode}</span>
            <span className="muted">User: {username}</span>
            <button className="btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
