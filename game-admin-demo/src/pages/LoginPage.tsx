import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authApi";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginApi({ username, password });
      localStorage.setItem("token", res.access_token);
      localStorage.setItem("username", username);
      navigate("/projects");
    } catch (error) {
      console.error(error);
      alert("登录失败，请检查用户名或密码");
    }
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