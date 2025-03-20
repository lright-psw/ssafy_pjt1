// 소켓 통신
import { Server } from "socket.io";
import pool from "../db/db.mjs";
import dotenv from "dotenv";

dotenv.config();

export function initSocket(server, sessionMiddleware) {
    const io = new Server(server, {
        cors: {
            origin: process.env.FRONT_SERVER_URL || "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on("connection", (socket) => {
        console.log("🔹 클라이언트 연결됨:", socket.id);

        // 회원가입 이벤트
        socket.on("register", async ({ userId, password }) => {
            if (!userId || !password) {
                socket.emit("registerFail", { message: "아이디와 비밀번호를 입력하세요." });
                return;
            }

            try {
                const connection = await pool.getConnection();

                // 중복 아이디 체크
                const [rows] = await connection.query("SELECT * FROM users WHERE userId = ?", [userId]);
                if (rows.length > 0) {
                    connection.release();
                    socket.emit("registerFail", { message: "이미 존재하는 사용자입니다." });
                    return;
                }

                // 신규 유저 등록
                await connection.query("INSERT INTO users (userId, password) VALUES (?, ?)", [userId, password]);
                connection.release();

                socket.emit("registerSuccess", { message: "회원가입 성공" });
            } catch (error) {
                console.error("회원가입 오류:", error);
                socket.emit("registerFail", { message: "서버 오류" });
            }
        });

        // 로그인 이벤트
        socket.on("login", async ({ userId, password }) => {
            if (!userId || !password) {
                socket.emit("loginFail", { message: "아이디와 비밀번호를 입력하세요." });
                return;
            }

            try {
                const connection = await pool.getConnection();
                const [rows] = await connection.query("SELECT * FROM users WHERE userId = ?", [userId]);
                connection.release();

                if (rows.length === 0) {
                    socket.emit("loginFail", { message: "등록되지 않은 사용자입니다." });
                    return;
                }

                if (rows[0].password !== password) {
                    socket.emit("loginFail", { message: "비밀번호가 일치하지 않습니다." });
                    return;
                }

                socket.request.session.user = { id: userId };
                socket.request.session.save(err => {
                    if (err) {
                        socket.emit("loginFail", { message: "세션 저장 실패" });
                    } else {
                        socket.emit("loginSuccess", { message: "로그인 성공" });
                    }
                });

            } catch (error) {
                console.error("로그인 오류:", error);
                socket.emit("loginFail", { message: "서버 오류" });
            }
        });

        // 로그아웃 이벤트
        socket.on("logout", () => {
            socket.request.session.destroy(() => {
                socket.emit("logoutSuccess", { message: "로그아웃 성공" });
            });
        });

        socket.on("disconnect", () => {
            console.log("🔹 클라이언트 연결 종료:", socket.id);
        });
    });
}
