"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      credentials: "include", // 쿠키
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, password }),
    });

    // 로그인 성공 시 이동
    if (res.ok) {
      router.push("/dashboard"); 
    } else {
      alert("로그인 실패!");
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#333" }}>
      <div style={{ background: "#aaa", padding: "20px", borderRadius: "8px" }}>
        <form onSubmit={handleLogin}>
          <div>
            <label>아이디</label>
            <input className="id_input" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div>
            <label>비밀번호</label>
            <input className="password_input"type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit">로그인</button>
        </form>
      </div>
    </div>
  );
}
