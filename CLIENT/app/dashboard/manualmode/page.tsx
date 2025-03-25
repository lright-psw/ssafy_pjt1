"use client";
import { useState } from "react";
import axios from "axios";
import "@/styles/manualmode.css";

export default function ManualMode() {
  const [altitude, setAltitude] = useState("");
  const [rotation, setRotation] = useState("");

  const handleSubmit = async () => {
    try {
      // 고도 전송
      if (altitude) {
        await axios.post(`/api/manual/altitude`, {
          value: altitude,
        });
      }

      // 회전 속도 전송
      if (rotation) {
        await axios.post(`/api/manual/rotation`, {
          value: rotation,
        });
      }
    } catch (error) {
      alert("전송 실패");
      console.error(error);
    }
  };

  return (
    <div className="manualmode-container">
      <div className="manualmode-box">
        <label>
          고도조정
          <input
            type="text"
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
          />
        </label>
        <label>
          날개 회전속도(1~99)
          <input
            type="text"
            value={rotation}
            onChange={(e) => setRotation(e.target.value)}
          />
        </label>
        <button onClick={handleSubmit}>변경</button>
      </div>
    </div>
  );
}
