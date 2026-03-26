import { Link, Outlet, useLocation } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const username = localStorage.getItem("username") ?? "bocai";

  const menuList = [
    { path: "/projects", label: "项目管理" },
    { path: "/assets", label: "资源管理" },
    { path: "/tasks", label: "任务中心" },
    { path: "/convas", label: "Canvas 编辑" },
    { path: "/gridhightlight", label: "格子高亮" },
  ];

  return (
    <div className="layout">
      <aside className="sidebar">
        <h2 className="logo">Game Admin</h2>
        <nav className="menu">
          {menuList.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                location.pathname === item.path ? "menu-item active" : "menu-item"
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header className="topbar">
          <span>游戏平台后台管理 Demo</span>
          <span>当前用户：{username}</span>
        </header>
        <div className="page-body">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default Layout;
