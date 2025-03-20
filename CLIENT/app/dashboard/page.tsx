"use client";

import { useState, useEffect } from "react";
import {useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import axios from "axios";

export default function DashboardPage() {
    const router = useRouter();
    const [socket, setSocket] = useState<Socket | null>(null);
    const [user, setUser] = useState<{ id: string | null } | null>(null);
    
    useEffect(() => {

        const checkSession = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/main`, {
                    withCredentials: true
                });

                if (res.status === 200) {
                    setUser(res.data.user);
                } else {
                    router.push("/");
                }
            } catch (error) {
                router.push("/");
            }
        };
        
        checkSession();
    }, []);

    const handleLogout = async () => {
        if (!socket) 
            return;
        socket.emit("logout");

        socket.on("logoutSuccess", () => {
            console.log("로그아웃 성공, 로그인 페이지로 이동");
            router.push("/");
        });
    };

    if (user === null) 
        return <p>로딩중 ...</p>;
    if (!user.id) {
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
