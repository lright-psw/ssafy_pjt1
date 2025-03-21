// 로그인 & 로그아웃 API
import express from "express";
import pool from "../db/db.mjs";

const authRoute = express.Router();

// 회원가입 API
authRoute.post("/register", async(req,res) =>{
    const {userId,password} = req.body;

    // 아이디 비밀번호가 없음
    if(!userId|| !password){
        return res.status(400).json({message: "아이디와 비밀번호를 입력하세요."});
    }

    try {
        const connection = await pool.getConnection();

        // 기존에 있는 회원인지 확인
        const [rows] = await connection.query("SELECT * FROM users WHERE userId = ?", [userId]);
        if (rows.length > 0) {
            connection.release();
            return res.status(400).json({ message: "이미 존재하는 사용자입니다." });
        }

        await connection.query("INSERT INTO users (userId, password) VALUES (?, ?)", [userId, password]);
        connection.release();

        res.json({ message: "회원가입 성공" });
    } catch (error) {
        console.error("회원가입 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 로그인 API
authRoute.post("/login", async (req,res) => {
    const {userId,password} = req.body;

    // 아이디 비밀번호가 없음
    if(!userId|| !password){
        return res.status(400).json({message: "아이디와 비밀번호를 입력하세요."});
    }

    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query("SELECT * FROM users WHERE userId = ?", [userId]);
        connection.release();

        
        if (rows.length === 0) {
            return res.status(401).json({ message: "등록되지 않은 사용자입니다." });
        }

        // 비밀번호 틀림
        if (rows[0].password !== password) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        req.session.user = { id: userId };
        // 세션 오류류
        req.session.save(err => {
            if (err) return res.status(500).json({ message: "세션 저장 실패" });
            res.json({ message: "로그인 성공" });
        });
    } catch (error) {
        console.error("로그인 오류:", error);
        res.status(500).json({ message: "서버 오류" });
    }
});

// 로그아웃 API
authRoute.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("session-cookie");
        res.json({ message: "로그아웃 성공" });
    });
});

authRoute.get("/main", (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(401).json({ message: "세션 없음" });
});

export default authRoute;