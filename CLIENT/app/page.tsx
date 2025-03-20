"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import "@/styles/loginPage.css";

export default function LoginPage() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL!, {
      withCredentials: true,
      transports: ["websocket", "polling"]
    });

    setSocket(newSocket);

    newSocket.on("loginSuccess", (data) => {
      router.push(`/dashboard`);
    });

    newSocket.on("loginFail", (data) => {
      alert(data.message || "로그인 실패");
    });

    newSocket.on("registerSuccess", () => {
      alert("회원가입 성공!");
    });

    newSocket.on("registerFail", (data) => {
      alert(data.message || "회원가입 실패");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleLogin = () => {
    if (!socket || !userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }
    socket.emit("login", { userId, password });
  };

  const handleRegister = () => {
    if (!socket || !userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }
    socket.emit("register", { userId, password });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        <input className="login-input-field" type="text" placeholder="아이디" value={userId} onChange={(e) => setUserId(e.target.value)} />
        <input className="login-input-field" type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="login-button" onClick={handleLogin}>로그인</button>
        <button className="register-button" onClick={handleRegister}>회원가입</button>
      </div>
    </div>
  );
}
