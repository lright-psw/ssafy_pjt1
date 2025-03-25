import express from "express";
import pool from "../db/db.mjs";

const router = express.Router();

router.get("/main", (req, res) => {
    if (req.session.user) {
        return res.json({ user: req.session.user });
    }
    return res.status(401).json({ message: "세션 없음" });
});

export default router;