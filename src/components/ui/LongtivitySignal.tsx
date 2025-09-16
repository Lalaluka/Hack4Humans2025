import React from 'react';

interface LongtivitySignalProps {
  efficiencyClass: string; // European energy efficiency class (A-G)
}

const classColors: Record<string, string> = {
  A: '#4caf50', // green
  B: '#8bc34a',
  C: '#cddc39',
  D: '#ffeb3b', // yellow
  E: '#ffc107',
  F: '#ff9800',
  G: '#f44336', // red
};

const LongtivitySignal: React.FC<LongtivitySignalProps> = ({ efficiencyClass }) => {
  const color = classColors[efficiencyClass] || '#888';
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '50%',
        background: color,
        border: '3px solid #222',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        marginLeft: 8,
        fontWeight: 700,
        color: '#222',
        fontSize: 18,
      }}
      title={`Energy Efficiency Class: ${efficiencyClass}`}
    >
      {efficiencyClass}
    </span>
  );
};

export default LongtivitySignal;
