import React, { useState } from "react";
import axios from "axios";

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? "/login" : "/register";
    try {
      const res = await axios.post(`http://localhost:5000/api/users${endpoint}`, {
        username,
        password,
      });
      setMessage(res.data.message || "✅ Thành công");
    } catch (err) {
      setMessage("❌ Lỗi: " + (err.response?.data?.message || "Không xác định"));
    }
  };

  return (
    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
      <h2>{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        /><br />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br />
        <button type="submit">{isLogin ? "Đăng nhập" : "Đăng ký"}</button>
      </form>
      <p style={{ color: "red" }}>{message}</p>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Chưa có tài khoản? Đăng ký" : "Đã có tài khoản? Đăng nhập"}
      </button>
    </div>
  );
}

export default LoginRegister;
