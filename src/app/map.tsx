"use client";
import { Icon } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import { POINTS } from "./points";

export const Map = () => {
  const [selectedPoints, setSelectedPoints] = useState<Set<number>>(new Set());

  const houseIcon = new Icon({
    iconUrl: "/location-pin.svg",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });

  const colors = [
    "#FF0000", // Red
    "#00FF00", // Lime
    "#0000FF", // Blue
    "#FFD700", // Gold
    "#FF1493", // Deep Pink
    "#00FFFF", // Cyan
    "#8B4513", // Saddle Brown
    "#4B0082", // Indigo
    "#32CD32", // Lime Green
    "#FF8C00", // Dark Orange
    "#9400D3", // Dark Violet
    "#008080", // Teal
    "#FF69B4", // Hot Pink
    "#556B2F", // Dark Olive Green
    "#8A2BE2", // Blue Violet
    "#FF4500", // Orange Red
    "#00CED1", // Dark Turquoise
    "#800000", // Maroon
    "#9932CC", // Dark Orchid
    "#006400", // Dark Green
  ];

  const togglePoint = (index: number) => {
    setSelectedPoints((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const getLines = () => {
    const lines: {
      options: {
        color: string;
        weight: number;
      };
      positions: { lat: number; lng: number }[];
    }[] = [];

    selectedPoints.forEach((pointIndex) => {
      const point = POINTS[pointIndex];
      const color = colors[pointIndex % colors.length];

      point.neighbors.forEach((neighbor) => {
        lines.push({
          options: {
            color: color,
            weight: 1,
          },
          positions: [
            { lat: point.latitud, lng: point.longitud },
            { lat: neighbor.latitud, lng: neighbor.longitud },
          ],
        });
      });
    });

    return lines;
  };

  const lines = getLines();

  return (
    <MapContainer
      center={{ lat: -10.322860207060069, lng: -75.54431664761874 }}
      zoom={6}
      style={{
        height: "800px",
        width: "100%",
        borderRadius: "0.75rem",
        zIndex: 0,
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {lines.map((line, index) => (
        <Polyline
          key={index}
          positions={line.positions}
          pathOptions={line.options}
        />
      ))}
      {POINTS.map((point, index) => (
        <Marker
          key={index}
          position={[point.latitud, point.longitud]}
          icon={houseIcon}
          eventHandlers={{
            click: () => togglePoint(index),
          }}
        >
          <Popup>
            <div className="text-sm font-medium">
              <div>Code: {point.name}</div>
              <div className="text-xs text-gray-600">
                {point.latitud.toFixed(4)}, {point.longitud.toFixed(4)}
              </div>
              <button
                onClick={() => togglePoint(index)}
                className="mt-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                {selectedPoints.has(index) ? "Hide Lines" : "Show Lines"}
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
