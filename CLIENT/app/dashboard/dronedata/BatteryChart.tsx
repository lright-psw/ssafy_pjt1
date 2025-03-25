"use client";
import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "@/styles/dronedata.css";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BatteryChart() {
  const [battery, setBattery] = useState(0);

  useEffect(() => {
    axios.get(`/api/battery`)
      .then(res => setBattery(res.data.level))
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels: ["사용됨", "남음"],
    datasets: [{
      data: [100 - battery, battery],
      backgroundColor: ["#e5e5e5", "#10b981"],
    }],
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">배터리</h2>
      <div className="doughnut-wrapper">
        <Doughnut data={data} />
        <div className="doughnut-label">{battery}%</div>
      </div>
    </div>
  );
}
