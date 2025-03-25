import express from "express";
const router = express.Router();

// 배터리 상태
router.get("/battery", (req, res) => {
  const level = Math.floor(Math.random() * 41) + 60; // 60~100%
  res.json({ level });
});

// 기압 & 온도
router.get("/temperature-pressure", (req, res) => {
  const timeLabels = ["09:10", "09:12", "09:14", "09:16"];
  const pressure = timeLabels.map(() => 950 + Math.random() * 20);
  const temperature = timeLabels.map(() => 20 + Math.random() * 10);
  res.json({ timeLabels, pressure, temperature });
});

// 시간별 모터 속도
router.get("/motor-speed", (req, res) => {
  const timeLabels = ["09:10", "09:11", "09:12", "09:13", "09:14"];
  const motorSpeed = timeLabels.map(() => Math.floor(Math.random() * 5000));
  res.json({ timeLabels, motorSpeed });
});

// 시간별 고도
router.get("/altitude", (req, res) => {
  const timeLabels = ["09:10", "09:11", "09:12", "09:13", "09:14"];
  const altitude = timeLabels.map(() => Math.floor(Math.random() * 50) + 10);
  res.json({ timeLabels, altitude });
});

export default router;
