import React from "react";

interface TrafficSignProps {
  score?: number; // Placeholder for future logic
}

const TrafficSign: React.FC<TrafficSignProps> = ({ score }) => {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 80,
        borderRadius: 12,
        background: "#222",
        border: "3px solid #e6b800",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        marginLeft: 8,
        flexDirection: "column",
        padding: 4,
      }}
      title={score !== undefined ? `Score: ${score}` : "Composite Score"}
    >
      {/* Red light (greyed out) */}
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#888",
          display: "block",
          margin: "2px auto",
          border: "2px solid #444",
        }}
      />
      {/* Yellow light (active) */}
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#ffe066",
          display: "block",
          margin: "2px auto",
          border: "2px solid #e6b800",
        }}
      />
      {/* Green light (greyed out) */}
      <span
        style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#888",
          display: "block",
          margin: "2px auto",
          border: "2px solid #444",
        }}
      />
    </span>
  );
};

export default TrafficSign;
