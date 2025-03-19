"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";


export default function dashboardPage(){
    const router = useRouter();
    const searchParams = useSearchParams();
    const userId = searchParams.get("userId");
    const [user, setUser] = useState<{ id: string | null }>({ id: userId });
    

    useEffect(()=>{
        const checkSession = async () =>{
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main`,{
                    withCredentials: true
                })
                if (res.status === 200) {
                    setUser(res.data.user);
                  }
            } catch (error) {
                router.push("/");
            }
        }
        checkSession();
    },[]);

    const handleLogout = async () => {
        try {
          await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {}, { withCredentials: true });
          router.push("/");
        } catch (error) {
          console.error("로그아웃 실패");
        }
      };

      if(!user)
        return <p>로딩중 ....</p>;

      return (
        <div>
            <h1>안녕하세요</h1>
            <p>환영합니다, {user.id}님</p>
            <button onClick={handleLogout}>로그아웃</button>
        </div>
      )
}