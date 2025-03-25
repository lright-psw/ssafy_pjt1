"use client";
import BatteryChart from "./BatteryChart";
import PressureTemperatureChart from "./PressureTemperatureChart";
import MotorSpeedChart from "./MotorSpeedChart";
import AltitudeChart from "./AltitudeChart";
import "@/styles/dronedata.css";

export default function DroneDataPage() {
  return (
    <div className="dronedata-grid">
      <BatteryChart />
      <PressureTemperatureChart />
      <MotorSpeedChart />
      <AltitudeChart />
    </div>
  );
}
