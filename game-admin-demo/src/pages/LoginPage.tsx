import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      alert("请输入用户名和密码");
      return;
    }

    navigate("/projects");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>游戏平台后台</h1>
        <p className="muted">登录后进入项目管理控制台</p>

        <input
          className="input"
          placeholder="请输入用户名"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn primary" onClick={handleLogin}>
          登录
        </button>
      </div>
    </div>
  );
}

export default LoginPage;