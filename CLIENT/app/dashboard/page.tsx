"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string | null } | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main`,
          {
            withCredentials: true, // 세션 쿠키 보내기
          }
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
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`,
        {},
        {
          withCredentials: true,
        }
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
    <div>
      <h1>안녕하세요</h1>
      <p>환영합니다, {user.id}님</p>
      <button onClick={handleLogout}>로그아웃</button>
    </div>
  );
}
