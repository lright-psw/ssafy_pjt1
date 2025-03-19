import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import db from "./db.js";

dotenv.config(); // 환경변수 로드

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONT_SERVER_URL || "http://localhost:3000";

console.log("SESSION SECRET:", process.env.COOKIE_SECRET); // 환경변수 확인
console.log("PORT:", PORT);
console.log("FRONTEND_URL:", FRONTEND_URL);

const app = express();
const server = http.createServer(app);

// CORS 설정 (Express API)
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 미들웨어 (SECRET 기본값 추가)
const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET || "defaultsecret", // 환경변수 없을 때 기본값 추가
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false, // 로컬 개발에서는 false (배포 시 true)
        maxAge: 3600000 // 1시간 유지
    },
    name: "session-cookie"
});

app.use(sessionMiddleware);

// Socket.io 설정 (CORS 해결)
const io = new Server(server, {
    cors: {
        origin: FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Socket.io에서 Express 세션 공유
io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

// Socket.io 연결
io.on("connection", (socket) => {
    console.log("클라이언트 로그인 소켓 연결됨:", socket.id);

    // 로그인 이벤트
    socket.on("login", ({ userId, password }) => {
        if (userId === "1234" && password === "1234") {
            socket.request.session.user = { id: userId };
            socket.request.session.save(err => {
                if (err) {
                    socket.emit("loginFail", { message: "세션 저장 실패" });
                } else {
                    socket.emit("loginSuccess", { message: "로그인 성공" });
                }
            });
        } else {
            socket.emit("loginFail", { message: "로그인 실패" });
        }
    });

    // 세션 확인
    socket.on("checksession", () => {
        if (socket.request.session.user) {
            socket.emit("sessionValid", { user: socket.request.session.user });
        } else {
            socket.emit("sessionInvalid", { message: "세션 없음" });
        }
    });

    // 로그아웃 이벤트
    socket.on("logout", () => {
        socket.request.session.destroy(() => {
            socket.emit("logoutSuccess", { message: "로그아웃 성공" });
        });
    });

    socket.on("disconnect", () => {
        console.log("로그인 소켓 연결 종료:", socket.id);
    });
});

// API
// 로그인 처리
app.post("/api/login", (req, res) => {
    try {
        const { userId, password } = req.body;

        console.log("로그인 요청:", userId, password);

        if (userId === "1234" && password === "1234") {
            req.session.user = { id: userId };
            req.session.save(err => {
                if (err) {
                    console.error("세션 저장 실패:", err);
                    return res.status(500).json({ message: "세션 저장 실패" });
                }
                res.json({ message: "로그인 성공" });
            });
        } else {
            res.status(401).json({ message: "아이디 또는 비밀번호가 잘못됨" });
        }
    } catch (error) {
        console.error("로그인 처리 중 오류 발생:", error);
        res.status(500).json({ message: "서버 내부 오류" });
    }
});

app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("session-cookie");
        res.json({ message: "로그아웃 성공" });
    });
});

app.get("/api/main", (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(401).json({ message: "세션 없음" });
});

// 서버 실행
server.listen(PORT, () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
});
