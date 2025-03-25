import net from "net";
import { spawn } from "child_process";

const server = net.createServer((socket) => {
  console.log("백엔드 연결됨");

  socket.on("data", (data) => {
    const msg = data.toString();
    console.log("수신한 데이터:", msg);

    let message;
    try {
      message = JSON.parse(msg);
    } catch (err) {
      console.error("JSON 파싱 오류:", err);
      return;
    }

    if (message.rotation !== undefined) {
      const angle = parseInt(message.rotation);

      const python = spawn("python3", ["rotate_motor.py", angle]);

      python.stdout.on("data", (data) => {
        console.log(`파이썬 출력: ${data}`);
      });

      python.stderr.on("data", (data) => {
        console.error(`파이썬 오류: ${data}`);
      });

      python.on("close", (code) => {
        console.log(`파이썬 종료 코드: ${code}`);
        socket.write("ack"); // 응답 전송
      });
    }
  });

  socket.on("end", () => {
    console.log("백엔드 연결 종료");
  });
});

server.listen(9999, '0.0.0.0', () => {
    console.log("✅ TCP 서버 실행 중 (포트 9999, IPv4)");
  });
