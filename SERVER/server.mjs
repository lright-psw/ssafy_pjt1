// 메인 서버
import express from "express";
import http from "http";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// import loginRoutes from "./routes/login.mjs";
import sessionRoutes from "./routes/session.mjs";
import { initSocket } from "./socket/socket.mjs";
import pool from "./db/db.mjs";

dotenv.config(); // 환경변수 로드

const PORT = process.env.PORT || 8000;
const FRONTEND_URL = process.env.FRONT_SERVER_URL || "http://localhost:3000";

const app = express();
const server = http.createServer(app);

// CORS 설정
app.use(cors({
    origin: FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// 세션 미들웨어
const sessionMiddleware = session({
    secret: process.env.COOKIE_SECRET || "defaultsecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 3600000
    },
    name: "session-cookie"
});

app.use(sessionMiddleware);
// app.use("/api", loginRoutes);
app.use("/api", sessionRoutes);

// 소켓 활성화 
initSocket(server, sessionMiddleware);

// 서버 실행
server.listen(PORT, async () => {
    console.log(`서버 실행 중: http://localhost:${PORT}`);
    try {
        const connection = await pool.getConnection();
        console.log("MySQL 연결 성공");
        connection.release();
    } catch (error) {
        console.error("MySQL 연결 실패:", error);
    }
});
