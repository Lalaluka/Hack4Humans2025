import React, { useState } from 'react';


import InfoRowCard from './InfoRowCard';

interface LongtivitySectionProps {
  longtivityData?: any;
}

const LongtivitySection: React.FC<LongtivitySectionProps> = ({ longtivityData }) => {
  const [open, setOpen] = useState<boolean>(true);
  const efficiencyClass = longtivityData?.energy?.efficiencyClass || 'N/A';
  // Status logic
  let status: 'success' | 'warning' | 'danger' = 'success';
  if (['A', 'B', 'C'].includes(efficiencyClass)) {
    status = 'success';
  } else if (['D', 'E'].includes(efficiencyClass)) {
    status = 'warning';
  } else if (['F', 'G'].includes(efficiencyClass)) {
    status = 'danger';
  }

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: status === 'success' ? '#f6fff6' : '#fff6f6',
          borderRadius: 6,
          padding: '0.8rem 1.2rem',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 18,
          border: '1px solid #eee',
          marginBottom: 10,
        }}
        onClick={() => setOpen((v) => !v)}
      >
  <span style={{ color: '#222' }}>Langlebigkeit</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {status === 'success' ? (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#388e3c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          )}
          {open ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
          )}
        </span>
      </div>
      {open && (
        <>
          <InfoRowCard
            title="Energieeffizienz"
            details={
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{
                  display: 'inline-block',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: '#fff',
                  color: '#222',
                  fontWeight: 700,
                  fontSize: 20,
                  textAlign: 'center',
                  lineHeight: '36px',
                  border: '2px solid #eee',
                  position: 'relative',
                }}>
                  {efficiencyClass}
                </span>
                <span>Energieeffizienzklasse: {efficiencyClass}</span>
              </div>
            }
            status={status}
            iconStatus={status}
            style={{ marginBottom: 10 }}
          />
          {/* Battery subpoint */}
          {longtivityData?.energy?.battery && (
            <InfoRowCard
              title="Batterie"
              details={
                <>
                  Kapazität: {longtivityData.energy.battery.capacity_mAh} mAh<br />
                  Lebensdauer pro Zyklus: {longtivityData.energy.battery.lifetimePerCycle_h} h<br />
                  Lebenszyklen: {longtivityData.energy.battery.lifetimeCycles}
                </>
              }
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}
          {/* Reliability subpoint */}
          {longtivityData?.reliability?.dropTest?.class && (
            <InfoRowCard
              title="Robustheit"
              details={
                <>
                  Falltest-Klasse: {longtivityData.reliability.dropTest.class}<br />
                  Freier Fall ohne Schaden: {longtivityData.reliability.dropTest.freeFall_noDamage}
                </>
              }
              status={
                ['A', 'B', 'C'].includes(longtivityData.reliability.dropTest.class) ? 'success' :
                ['D', 'E'].includes(longtivityData.reliability.dropTest.class) ? 'warning' : 'danger'
              }
              iconStatus={
                ['A', 'B', 'C'].includes(longtivityData.reliability.dropTest.class) ? 'success' :
                ['D', 'E'].includes(longtivityData.reliability.dropTest.class) ? 'warning' : 'danger'
              }
              style={{ marginBottom: 10 }}
            />
          )}
          {/* Repairability subpoint */}
          {longtivityData?.repairability?.class && (
            <InfoRowCard
              title="Reparierbarkeit"
              details={
                <>
                  Klasse: {longtivityData.repairability.class}<br />
                  Garantierte Updates (Jahre): {longtivityData.repairability.guaranteedUpdates_years}<br />
                  Index: {longtivityData.repairability.index}
                </>
              }
              status={
                ['A', 'B', 'C'].includes(longtivityData.repairability.class) ? 'success' :
                ['D', 'E'].includes(longtivityData.repairability.class) ? 'warning' : 'danger'
              }
              iconStatus={
                ['A', 'B', 'C'].includes(longtivityData.repairability.class) ? 'success' :
                ['D', 'E'].includes(longtivityData.repairability.class) ? 'warning' : 'danger'
              }
              style={{ marginBottom: 10 }}
            />
          )}
        </>
      )}
  {/* Removed stray closing Card tag after refactor to InfoRowCard */}
    </div>
  );
};

export default LongtivitySection;
