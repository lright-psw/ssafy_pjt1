"use client";
import { useEffect } from "react";
import "@/styles/path.css"

export default function Path() {
  useEffect(() => {
    const kakaoMapInit = () => {
      const kakao = (window as any).kakao;
      const container = document.getElementById("map");

      if (!container) return;

      const options = {
        center: new kakao.maps.LatLng(37.556038, 126.922975),
        level: 3,
      };

      const map = new kakao.maps.Map(container, options);

      let drawingFlag = false;
      let moveLine: any;
      let clickLine: any;
      let distanceOverlay: any;
      let dots: any[] = [];

      kakao.maps.event.addListener(map, "click", function (mouseEvent: any) {
        const clickPosition = mouseEvent.latLng;

        if (!drawingFlag) {
          drawingFlag = true;

          deleteClickLine();
          deleteDistance();
          deleteCircleDot();

          clickLine = new kakao.maps.Polyline({
            map,
            path: [clickPosition],
            strokeWeight: 3,
            strokeColor: "#db4040",
            strokeOpacity: 1,
            strokeStyle: "solid",
          });

          moveLine = new kakao.maps.Polyline({
            strokeWeight: 3,
            strokeColor: "#db4040",
            strokeOpacity: 0.5,
            strokeStyle: "solid",
          });

          displayCircleDot(clickPosition, 0);
        } else {
          const path = clickLine.getPath();
          path.push(clickPosition);
          clickLine.setPath(path);

          const distance = Math.round(clickLine.getLength());
          displayCircleDot(clickPosition, distance);
        }
      });

      kakao.maps.event.addListener(map, "mousemove", function (mouseEvent: any) {
        if (drawingFlag) {
          const mousePosition = mouseEvent.latLng;
          const path = clickLine.getPath();
          const movepath = [path[path.length - 1], mousePosition];
          moveLine.setPath(movepath);
          moveLine.setMap(map);

          const distance = Math.round(clickLine.getLength() + moveLine.getLength());
          const content = `<div class="dotOverlay distanceInfo">총거리 <span class="number">${distance}</span>m</div>`;
          showDistance(content, mousePosition);
        }
      });

      kakao.maps.event.addListener(map, "rightclick", function () {
        if (drawingFlag) {
          moveLine.setMap(null);
          moveLine = null;

          const path = clickLine.getPath();

          if (path.length > 1) {
            if (dots[dots.length - 1].distance) {
              dots[dots.length - 1].distance.setMap(null);
              dots[dots.length - 1].distance = null;
            }

            const distance = Math.round(clickLine.getLength());
            const content = getTimeHTML(distance);
            showDistance(content, path[path.length - 1]);
          } else {
            deleteClickLine();
            deleteCircleDot();
            deleteDistance();
          }

          drawingFlag = false;
        }
      });

      function deleteClickLine() {
        if (clickLine) {
          clickLine.setMap(null);
          clickLine = null;
        }
      }

      function showDistance(content: string, position: any) {
        if (distanceOverlay) {
          distanceOverlay.setPosition(position);
          distanceOverlay.setContent(content);
        } else {
          distanceOverlay = new kakao.maps.CustomOverlay({
            map,
            content,
            position,
            xAnchor: 0,
            yAnchor: 0,
            zIndex: 3,
          });
        }
      }

      function deleteDistance() {
        if (distanceOverlay) {
          distanceOverlay.setMap(null);
          distanceOverlay = null;
        }
      }

      function displayCircleDot(position: any, distance: number) {
        const circleOverlay = new kakao.maps.CustomOverlay({
          content: '<span class="dot"></span>',
          position,
          zIndex: 1,
        });
        circleOverlay.setMap(map);

        let distanceOverlay = null;

        if (distance > 0) {
          distanceOverlay = new kakao.maps.CustomOverlay({
            content: `<div class="dotOverlay">거리 <span class="number">${distance}</span>m</div>`,
            position,
            yAnchor: 1,
            zIndex: 2,
          });
          distanceOverlay.setMap(map);
        }

        dots.push({ circle: circleOverlay, distance: distanceOverlay });
      }

      function deleteCircleDot() {
        for (const dot of dots) {
          if (dot.circle) dot.circle.setMap(null);
          if (dot.distance) dot.distance.setMap(null);
        }
        dots = [];
      }

      function getTimeHTML(distance: number) {
        const walkTime = distance / 67 | 0;
        const bikeTime = distance / 227 | 0;

        const walkHour = walkTime > 60 ? `${Math.floor(walkTime / 60)}시간 ` : "";
        const walkMin = `${walkTime % 60}분`;

        const bikeHour = bikeTime > 60 ? `${Math.floor(bikeTime / 60)}시간 ` : "";
        const bikeMin = `${bikeTime % 60}분`;

        return `
        <ul class="dotOverlay distanceInfo">
          <li><span class="label">총거리</span><span class="number">${distance}</span>m</li>
          <li><span class="label">도보</span>${walkHour}${walkMin}</li>
          <li><span class="label">자전거</span>${bikeHour}${bikeMin}</li>
        </ul>`;
      }
    };

    if ((window as any).kakao && (window as any).kakao.maps) {
      kakaoMapInit();
    } else {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        (window as any).kakao.maps.load(() => {
          kakaoMapInit();
        });
      };
    }
  }, []);

  return (
    <div className="dronpage-section">
      <h3 className="text-lg font-bold mb-2">드론 이동 경로</h3>
      <div
        id="map"
        className="w-[380px] h-[500px] border border-gray-500 rounded-lg shadow-md"
      ></div>
    </div>
  );
}
