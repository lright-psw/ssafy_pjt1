"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import "@/styles/mainpage.css";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string | null } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `/api/main`,
          { withCredentials: true }
        );

        if (res.status === 200) {
          setUser(res.data.user);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("세션 확인 실패", error);
        router.push("/");
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        `/api/logout`,
        {},
        { withCredentials: true }
      );
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  if (user === null) return <p>로딩중 ...</p>;

  if (!user?.id) {
    router.push("/");
    return null;
  }

  return (
    <div className="main-container">
      <Image
        src="/logo.png"
        alt="로고"
        className="main-logo"
        width={180}
        height={180}
        priority
      />
      <h1>드론 관리 시스템</h1>
      <p className="main-welcome">환영합니다, {user.id}님</p>
      <button className="logout-button" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}
