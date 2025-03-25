"use client";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function MotorSpeedChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [speedData, setSpeedData] = useState<number[]>([]);

  useEffect(() => {
    axios.get(`/api/motor-speed`)
      .then(res => {
        setLabels(res.data.timeLabels);
        setSpeedData(res.data.motorSpeed);
      })
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels,
    datasets: [{
      label: "모터 속도",
      data: speedData,
      backgroundColor: "#60a5fa",
    }],
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">시간별 모터 속도</h2>
      <Bar data={data} />
    </div>
  );
}
