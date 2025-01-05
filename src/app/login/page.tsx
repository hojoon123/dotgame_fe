"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { loginUser } from "../../services/api/userApi";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleLogin = async () => {
    try {
      const data = await loginUser(username, password);
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setMsg(`로그인 성공: ${data.username}`);
      alert("로그인 성공");
      router.push("/game");
    } catch (error: any) {
      console.error(error);
      setMsg(error.response?.data?.detail || "로그인 실패");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h1>로그인</h1>
      <div>
        <input
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin} style={{ marginTop: 10 }}>
        로그인
      </button>
      <p>{msg}</p>
    </div>
  );
}
