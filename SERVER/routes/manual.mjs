import express from "express";
import net from "net";
import dotenv from "dotenv";

dotenv.config();
const router = express.Router();

const RPI_HOST = process.env.RASPBERRY_PI_PUBLIC_IP || "192.168.110.37";
const RPI_PORT = 9999;

// 고도 조정 (단순 응답)
router.post("/manual/altitude", (req, res) => {
  const { value } = req.body;
  console.log("고도 수신:", value);
  return res.json({ message: `고도 ${value}m 수신 완료` });
});

// 회전 속도 조정 (TCP 전송)
router.post("/manual/rotation", (req, res) => {
  const { value } = req.body;

  const rpm = parseInt(value);
  if (isNaN(rpm) || rpm < 0 || rpm > 100) {
    return res.status(400).json({ message: "잘못된 회전수" });
  }

  const client = new net.Socket();
  let responded = false;

  client.connect(RPI_PORT, RPI_HOST, () => {
    console.log("라즈베리파이에 연결됨");
    client.write(JSON.stringify({ rotation: rpm }));
  });

  client.on("data", (data) => {
    console.log("라즈베리파이 응답:", data.toString());
    if (!responded) {
      responded = true;
      res.json({ message: "라즈베리파이 처리 완료", response: data.toString() });
      client.destroy();
    }
  });

  client.on("error", (err) => {
    console.error("TCP 오류:", err.message);
    if (!responded) {
      responded = true;
      res.status(500).json({ message: "라즈베리파이 연결 실패", error: err.message });
    }
  });

  client.on("close", () => {
    console.log("TCP 연결 종료");
  });

  setTimeout(() => {
    if (!responded) {
      responded = true;
      res.status(504).json({ message: "라즈베리파이 응답 시간 초과" });
      client.destroy();
    }
  }, 3000);
});

export default router;
