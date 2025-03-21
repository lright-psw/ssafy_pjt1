"use client";
import "@/styles/dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-sidebar">
          <h2>대시보드 메뉴</h2>
          <ul>
            <li><a href="/dashboard">홈</a></li>
            <li><a href="/dashboard/dronepage">드론 화면</a></li>
            <li><a href="/dashboard/dronedata">데이터</a></li>
            <li><a href="/dashboard/manualmode">수동 조작 모드</a></li>
            <li><a href="/dashboard/settings">설정</a></li>
          </ul>
        </nav>
        <main className="dashboard-content">{children}</main>
      </div>
    );
  }