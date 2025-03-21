"use client";
import { useEffect } from "react";

export default function Path() {
  useEffect(() => {
    // 카카오맵 SDK가 이미 로드된 경우 실행 방지
    if (typeof window !== "undefined" && (window as any).kakao && (window as any).kakao.maps) {
      initMap();
      return;
    }

    // 카카오맵 스크립트 로드
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).kakao.maps.load(() => {
        initMap();
      });
    };

    function initMap() {
      const container = document.getElementById("map");
      if (!container) return;

      const options = {
        center: new (window as any).kakao.maps.LatLng(37.556019, 126.922984),
        level: 3, // 줌 레벨
      };

      const map = new (window as any).kakao.maps.Map(container, options);

      // 드론 위치 마커 추가
      const markerPosition = new (window as any).kakao.maps.LatLng(37.556019, 126.922984);
      const marker = new (window as any).kakao.maps.Marker({ position: markerPosition });

      marker.setMap(map);
    }
  }, []);

  return (
    <div className="dronpage-section">
      <h3 className="text-lg font-bold mb-2">드론 이동 경로</h3>
      <div id="map" className="w-[355px] h-[400px] border border-gray-500 rounded-lg shadow-md"></div>
    </div>
  );
}
