"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import "@/styles/loginPage.css";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // 자동 로그인 리디렉션 추가
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `/api/main`,
          { withCredentials: true }
        );

        if (res.status === 200 && res.data.user?.id) {
          router.push("/dashboard");
        }
      } catch (error) {
        // 세션 없으면 아무것도 안 함 (로그인 화면 그대로 보여줌)
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        `/api/login`,
        { userId, password },
        { withCredentials: true }
      );

      if (res.status === 200) {
        router.push("/dashboard");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "로그인 실패");
    }
  };

  const handleRegister = async () => {
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await axios.post(
        `/api/register`,
        { userId, password }
      );

      if (res.status === 200) {
        alert("회원가입 성공! 이제 로그인하세요.");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">로그인</h2>
        <input
          className="login-input-field"
          type="text"
          placeholder="아이디"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />
        <input
          className="login-input-field"
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="login-button" onClick={handleLogin}>로그인</button>
        <button className="register-button" onClick={handleRegister}>회원가입</button>
      </div>
    </div>
  );
}
