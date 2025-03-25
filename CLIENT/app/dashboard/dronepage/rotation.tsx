"use client";
import Image from "next/image";

export default function Rotation() {
  return (
    <div className="dronpage-section">
      <h3>드론 3D 회전</h3>
      <Image src="/rotation.png" alt="드론 회전" width={360} height={300} />
    </div>
  );
}
