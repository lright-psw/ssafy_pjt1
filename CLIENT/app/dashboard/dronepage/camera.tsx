"use client";
import Image from "next/image";

export default function Camera() {
  return (
    <div className="dronpage-section">
      <h3>카메라 화면</h3>
      <Image src="/camera.png" alt="드론 카메라 화면" width={360} height={250} />
    </div>
  );
}
