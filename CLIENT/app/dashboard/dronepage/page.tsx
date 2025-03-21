"use client";
import "@/styles/dronepage.css";
import Rotation from "./rotation";
import Path from "./path";
import Camera from "./camera";

export default function DronPage() {
  return (
    <div className="dronpage-container">
      <h2 className="dronpage-title">드론 화면</h2>
      <div className="dronpage-grid">
        <Path />
        <Camera />
        <Rotation />
      </div>
    </div>
  );
}
