"use client";
import "@/styles/dronepage.css";
import Rotation from "./rotation";
import Path from "./path";
import Camera from "./camera";

export default function DronPage() {
  return (
    <div className="dronpage-container">
      <h2 className="dronpage-title">드론 화면</h2>

      {/* 위쪽: 이동 경로 + 카메라 */}
      <div className="dronpage-top">
        <Path />
        <Camera />
      </div>

      {/* 아래쪽: 드론 회전 */}
      <div className="dronpage-bottom">
        <Rotation />
      </div>
    </div>
  );
}
