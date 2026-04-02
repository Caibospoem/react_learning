import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../services/authApi";

function LoginPage() {
  const [username, setUsername] = useState("bocai");
  const [password, setPassword] = useState("123456");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await loginApi({ username, password });
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("username", username);
      navigate("/studio");
    } catch (error) {
      console.error(error);
      alert("Login failed. Check username/password.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>AI Game Creator Demo</h1>
        <p className="muted">Log in to continue.</p>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button className="btn primary" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default LoginPage;

