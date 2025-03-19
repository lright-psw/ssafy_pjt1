"use client";
import "@/styles/dashboard.css";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
      <div className="dashboard-container">
        <nav className="dashboard-sidebar">
          <h2>대시보드 메뉴</h2>
          <ul>
            <li><a href="/dashboard">홈</a></li>
            <li><a href="/dashboard/settings">설정</a></li>
          </ul>
        </nav>
        <main className="dashboard-content">{children}</main>
      </div>
    );
  }