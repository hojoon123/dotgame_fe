"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { registerUser } from "../../services/api/userApi";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleRegister = async () => {
    try {
      const data = await registerUser(username, password);
      setMsg(data.detail); // "User created."
      // 회원가입 성공 후 로그인 페이지로 이동
      router.push("/login");
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.detail) {
        setMsg(error.response.data.detail);
      } else {
        setMsg("회원가입 실패.");
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>회원가입</h1>
      <div style={{ marginBottom: 10 }}>
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
          style={{ marginRight: 10 }}
        />
      </div>
      <button onClick={handleRegister}>회원가입</button>
      <p>{msg}</p>
    </div>
  );
}
