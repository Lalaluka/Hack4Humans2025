
import React, { useState } from "react";
import { Check, X, ChevronDown, ChevronUp, Info } from "lucide-react";
import InfoRowCard from './InfoRowCard';

// Row component with its own state
function ToxicityAccordionRow({ chem }: { chem: ToxicityAccordionItem }) {
  const [showInfo, setShowInfo] = React.useState(false);
  const status = chem.exceeded ? 'danger' : 'success';
  return (
    <InfoRowCard
      title={`${chem.name} (${chem.symbol})`}
      details={
        <>
          <span style={{ fontSize: 12 }}><strong>Regulation:</strong> {chem.regulation}</span><br />
          <span style={{ fontSize: 12 }}><strong>Threshold:</strong> {chem.threshold}</span>
          {showInfo && (
            <p style={{ margin: "6px 0", fontSize: 13 }}>{chem.description}</p>
          )}
        </>
      }
      status={status}
      iconStatus={status}
    >
      <button
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: 8 }}
        aria-label="Show info"
        onClick={() => setShowInfo((v) => !v)}
      >
        <Info size={20} color="#555" />
      </button>
    </InfoRowCard>
  );
}

export type ToxicityAccordionItem = {
  id: number;
  name: string;
  symbol: string;
  regulation: string;
  threshold: string;
  description: string;
  exceeded: boolean;
};

export type ToxicityAccordionProps = {
  title?: string;
  items: ToxicityAccordionItem[];
  width?: number | string;
};

const ToxicityAccordion: React.FC<ToxicityAccordionProps> = ({ title = "Toxicity Data", items, width = 500 }) => {
  const [open, setOpen] = useState(false);
  const allSafe = items.every((chem) => !chem.exceeded);

  return (
  <div style={{ marginTop: "2rem", color: "#000", width, marginLeft: "auto", marginRight: "auto" }}>
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
          border: "1px solid #eee"
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
        <div style={{ marginTop: "1rem", background: '#f6faff', borderRadius: 8, padding: '0.5rem 0' }}>
          {items.map((chem, idx) => (
            <ToxicityAccordionRow key={chem.id} chem={chem} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ToxicityAccordion;
