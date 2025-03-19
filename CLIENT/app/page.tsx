"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { io, Socket  } from "socket.io-client";
import axios from "axios";
import "@/styles/loginPage.css";

export default function LoginPage() {
  const [socket, setSocket] = useState<Socket|null>(null);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
        console.error("환경변수(NEXT_PUBLIC_BACKEND_URL)가 설정되지 않았습니다.");
        return;
    }

    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_URL, {
        withCredentials: true,
        transports: ["websocket", "polling"]
    });

    setSocket(newSocket);

    return () => {
        newSocket.disconnect();
    };
}, []);

  const handleLogin = async () => {
    if(!socket)
      return;

    console.log("입력된 아이디:", userId);
    console.log("입력된 비밀번호:", password);

    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/login`,
        { userId, password },
        { withCredentials: true }
    );

    console.log("로그인 응답:", res.status, res.data);

      if(res.status === 200){
        socket.emit("login",{ userId, password });
        router.push("/dashboard");
      }
    } catch (error) {
      alert("로그인 실패");
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        <input 
        className="login-input-field"
        type="text"
        placeholder="아이디"
        value={userId}
        onChange={(e)=>setUserId(e.target.value)}/>
        <input 
        className="login-input-field"
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}/>
        <button className="login-button" onClick={handleLogin}>로그인</button>
      </div>
    </div>
  );
}
