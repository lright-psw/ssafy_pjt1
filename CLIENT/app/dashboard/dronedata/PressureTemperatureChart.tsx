"use client";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend,ChartOptions
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function TemperaturePressureChart() {
  const [labels, setLabels] = useState<string[]>([]);
  const [tempData, setTempData] = useState<number[]>([]);
  const [pressData, setPressData] = useState<number[]>([]);

  useEffect(() => {
    axios.get(`/api/temperature-pressure`)
      .then(res => {
        setLabels(res.data.timeLabels);
        setTempData(res.data.temperature);
        setPressData(res.data.pressure);
      })
      .catch(err => console.error(err));
  }, []);

  const data = {
    labels,
    datasets: [
      { label: "기압", data: pressData, borderColor: "blue", yAxisID: "y1" },
      { label: "온도", data: tempData, borderColor: "red", yAxisID: "y2" },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    scales: {
      y1: {
        type: "linear",
        position: "left",
      },
      y2: {
        type: "linear",
        position: "right",
      },
    },
  };

  return (
    <div className="chart-container">
      <h2 className="chart-title">기압, 온도</h2>
      <Line data={data} options={options} />
    </div>
  );
}

