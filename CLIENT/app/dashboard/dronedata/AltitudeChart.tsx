"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function AltitudeChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [altitudeData, setAltitudeData] = useState<number[]>([]);

  useEffect(() => {
    axios.get(`/api/altitude`)
      .then(res => {
        setLabels(res.data.timeLabels);
        setAltitudeData(res.data.altitude);
      })
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels,
    datasets: [{
      label: "고도",
      data: altitudeData,
      borderColor: "#0ea5e9",
    }],
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">시간별 고도</h2>
      <Line data={data} />
    </div>
  );
}
