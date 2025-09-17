import React, { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Info } from "lucide-react";
import InfoRowCard from "./ui/info-row-card";

// Helper to convert "0.1%" string to numeric value
function parsePercent(value: string) {
  return parseFloat(value.replace("%", ""));
}

// Returns a smooth color from green → yellow → red based on percentage of threshold
function getToxicityGradientColor(percentage: number) {
  // Clamp percentage to 0-150 for visualization
  const p = Math.min(Math.max(percentage, 0), 150);

  let r: number,
    g: number,
    b = 0;

  if (p < 100) {
    // Green to yellow
    // Green RGB(46,204,0) → Yellow RGB(241,196,15)
    r = Math.round((241 - 46) * (p / 100) + 46);
    g = Math.round((196 - 204) * (p / 100) + 204);
  } else {
    // Yellow to red
    // Yellow RGB(241,196,15) → Red RGB(231,76,60)
    const extra = Math.min(p - 100, 50) / 50; // scale 0–50
    r = Math.round((231 - 241) * extra + 241);
    g = Math.round((76 - 196) * extra + 196);
  }

  return `rgb(${r},${g},${b})`;
}

// Row component with toxicity bar
function ToxicityAccordionRow({ chem }: { chem: ToxicityAccordionItem }) {
  const [showInfo, setShowInfo] = useState(false);

  // Parse numeric threshold and amount
  const thresholdValue = parsePercent(chem.threshold);
  const amountValue = chem.amount ? parsePercent(chem.amount) : 0;

  // Compute percentage of threshold
  const percentage = (amountValue / thresholdValue) * 100;

  // Determine bar color dynamically
  const barColor = getToxicityGradientColor(percentage);

  return (
    <InfoRowCard
      title={`${chem.name} (${chem.symbol})`}
      details={
        <>
          <span style={{ fontSize: 12 }}>
            <strong>Regulation:</strong> {chem.regulation}
          </span>
          <br />
          {/* <span style={{ fontSize: 12 }}>
            <strong>Threshold:</strong> {chem.threshold}
          </span> */}
          <br />
          <span style={{ fontSize: 12 }}>
            <strong>Amount:</strong> {chem.amount || "N/A"}
          </span>

          {/* Toxicity scale bar */}
          <div
            style={{
              height: 10,
              width: "100%",
              backgroundColor: "#eee",
              borderRadius: 4,
              marginTop: 4,
              marginBottom: 4,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: barColor,
                height: "100%",
                transition: "background-color 0.3s ease",
              }}
            />
          </div>
          <div style={{ fontSize: 10, marginBottom: 4 }}>
            {Math.round(percentage)}% of threshold
          </div>

          {showInfo && (
            <p style={{ margin: "6px 0", fontSize: 13 }}>{chem.description}</p>
          )}
        </>
      }
      status={percentage > 100 ? "danger" : "success"}
      iconStatus={percentage > 100 ? "danger" : "success"}
    >
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
          marginLeft: 8,
        }}
        aria-label="Show info"
        onClick={() => setShowInfo((v) => !v)}
      >
        <Info size={20} color="#555" />
      </button>
    </InfoRowCard>
  );
}

// Types
export type ToxicityAccordionItem = {
  id: number;
  name: string;
  symbol: string;
  regulation: string;
  threshold: string; // e.g., "0.1%"
  amount?: string; // e.g., "0.05%"
  description: string;
  exceeded: boolean;
};

export type ToxicityAccordionProps = {
  title?: string;
  items: ToxicityAccordionItem[];
  width?: number | string;
};

// Accordion component
const ToxicityAccordion: React.FC<ToxicityAccordionProps> = ({
  title = "Toxicity Data",
  items,
  width = 500,
}) => {
  const [open, setOpen] = useState(false);
  const allSafe = items.every((chem) => !chem.exceeded);

  return (
    <div
      style={{
        marginTop: "2rem",
        color: "#000",
        width,
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: allSafe ? "#f6fff6" : "#fff6f6",
          borderRadius: 6,
          padding: "0.8rem 1.2rem",
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 18,
          border: "1px solid #eee",
        }}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{title}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {allSafe ? (
            <Check color="#388e3c" size={32} strokeWidth={3} />
          ) : (
            <X color="#d32f2f" size={32} strokeWidth={3} />
          )}
          {open ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
        </span>
      </div>
      {open && (
        <div
          style={{
            marginTop: "1rem",
            borderRadius: 8,
            padding: "0.5rem 0",
          }}
        >
          {items.map((chem) => (
            <ToxicityAccordionRow key={chem.id} chem={chem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ToxicityAccordion;
