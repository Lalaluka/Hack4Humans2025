import React, { useState } from "react";

import InfoRowCard from "./ui/info-row-card";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface LongtivitySectionProps {
  longtivityData?: any;
}

const LongtivitySection: React.FC<LongtivitySectionProps> = ({
  longtivityData,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const efficiencyClass = longtivityData?.energy?.efficiencyClass || "N/A";
  const energy = longtivityData?.energy || {};
  const reliability = longtivityData?.reliability || {};
  const repairability = longtivityData?.repairability || {};
  const warranty = longtivityData?.warranty || {};
  // Status logic
  let status: "success" | "warning" | "danger" = "success";
  if (["A", "B", "C"].includes(efficiencyClass)) {
    status = "success";
  } else if (["D", "E"].includes(efficiencyClass)) {
    status = "warning";
  } else if (["F", "G"].includes(efficiencyClass)) {
    status = "danger";
  }

  return (
    <Card className="mt-4 rounded-2xl border">
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Longevity</CardTitle>
          <div className="flex items-center gap-3">
            <span
              className={
                `inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ` +
                (status === "success"
                  ? "bg-emerald-100 text-emerald-800"
                  : status === "warning"
                  ? "bg-amber-100 text-amber-800"
                  : "bg-red-100 text-red-800")
              }
            >
              {status === "success" ? "Compliant" : "Issues found"}
            </span>
            <button
              type="button"
              aria-expanded={open}
              aria-controls="longevity-details"
              onClick={() => setOpen((v) => !v)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md  hover:bg-muted"
            >
              {open ? (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </CardHeader>

      {open && (
        <CardContent id="longevity-details" className="pt-0 px-4 pb-4">
          <hr className="mb-4 border-muted" />
          <InfoRowCard
            title="Energy Efficiency"
            details={
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    display: "inline-block",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#fff",
                    color: "#222",
                    fontWeight: 700,
                    fontSize: 20,
                    textAlign: "center",
                    lineHeight: "36px",
                    border: "2px solid #eee",
                    position: "relative",
                  }}
                >
                  {efficiencyClass}
                </span>
                <span>Energy Efficiency Class: {efficiencyClass}</span>
              </div>
            }
            status={status}
            iconStatus={status}
            style={{ marginBottom: 10 }}
          />

          {energy.battery && (
            <InfoRowCard
              title="Battery"
              details={
                <>
                  Capacity: {energy.battery?.capacity_mAh} mAh
                  <br />
                  Lifetime per cycle: {energy.battery?.lifetimePerCycle_h} h
                  <br />
                  Lifetime cycles: {energy.battery?.lifetimeCycles}
                </>
              }
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}

          {(typeof energy.requiredChargerPower_W === "number" ||
            typeof energy.chargerConnector === "string" ||
            typeof energy.shippedWithProtectiveCover === "boolean") && (
            <InfoRowCard
              title="Charger & Connector"
              details={
                <>
                  {typeof energy.requiredChargerPower_W === "number" && (
                    <>
                      Required charger power: {energy.requiredChargerPower_W} W
                      <br />
                    </>
                  )}
                  {energy.chargerConnector && (
                    <>
                      Connector: {energy.chargerConnector}
                      <br />
                    </>
                  )}
                  {typeof energy.shippedWithProtectiveCover === "boolean" && (
                    <>
                      Shipped with protective cover:{" "}
                      {energy.shippedWithProtectiveCover ? "Yes" : "No"}
                    </>
                  )}
                </>
              }
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}

          {(reliability.waterResistance_m ||
            reliability.ingressProtection ||
            typeof reliability.screenScratchResistance_Mohs === "number") && (
            <InfoRowCard
              title="Protection"
              details={
                <>
                  {typeof reliability.ingressProtection === "string" && (
                    <>
                      Ingress Protection: {reliability.ingressProtection}
                      <br />
                    </>
                  )}
                  {typeof reliability.waterResistance_m === "number" && (
                    <>
                      Water resistance: {reliability.waterResistance_m} m
                      <br />
                    </>
                  )}
                  {typeof reliability.screenScratchResistance_Mohs ===
                    "number" && (
                    <>
                      Screen scratch resistance:{" "}
                      {reliability.screenScratchResistance_Mohs} Mohs
                    </>
                  )}
                </>
              }
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}

          {typeof energy.userReplaceableBattery === "boolean" && (
            <InfoRowCard
              title="User Replaceable Battery"
              details={<>{energy.userReplaceableBattery ? "Yes" : "No"}</>}
              status={energy.userReplaceableBattery ? "success" : "danger"}
              iconStatus={energy.userReplaceableBattery ? "success" : "danger"}
              style={{ marginBottom: 10 }}
            />
          )}

          {reliability.dropTest?.class && (
            <InfoRowCard
              title="Durability"
              details={
                <>
                  Drop Test Class: {reliability.dropTest.class}
                  <br />
                  Free fall without damage:{" "}
                  {reliability.dropTest.freeFall_noDamage}
                  {typeof reliability.dropTest.freeFall_extended_noDamage ===
                    "number" && (
                    <>
                      <br />
                      Extended free fall without damage:{" "}
                      {reliability.dropTest.freeFall_extended_noDamage}
                    </>
                  )}
                </>
              }
              status={
                ["A", "B", "C"].includes(reliability.dropTest.class)
                  ? "success"
                  : ["D", "E"].includes(reliability.dropTest.class)
                  ? "warning"
                  : "danger"
              }
              iconStatus={
                ["A", "B", "C"].includes(reliability.dropTest.class)
                  ? "success"
                  : ["D", "E"].includes(reliability.dropTest.class)
                  ? "warning"
                  : "danger"
              }
              style={{ marginBottom: 10 }}
            />
          )}

          {repairability.subScores && (
            <InfoRowCard
              title="Repairability – Subscores"
              details={
                <>
                  Disassembly depth: {repairability.subScores.disassemblyDepth}
                  <br />
                  Fasteners: {repairability.subScores.fasteners}
                  <br />
                  Tools: {repairability.subScores.tools}
                  <br />
                  Spare parts: {repairability.subScores.spareParts}
                  <br />
                  Software updates: {repairability.subScores.softwareUpdates}
                  <br />
                  Repair information:{" "}
                  {repairability.subScores.repairInformation}
                </>
              }
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}

          {repairability.links && (
            <InfoRowCard
              title="Repairability – Links"
              details={
                <>
                  {repairability.links.spareParts && (
                    <>
                      <a
                        href={repairability.links.spareParts}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Spare parts
                      </a>
                      <br />
                    </>
                  )}
                  {repairability.links.repairInstructions && (
                    <>
                      <a
                        href={repairability.links.repairInstructions}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Repair instructions
                      </a>
                      <br />
                    </>
                  )}
                  {repairability.links.priceGuidelines && (
                    <>
                      <a
                        href={repairability.links.priceGuidelines}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Price guidelines
                      </a>
                    </>
                  )}
                </>
              }
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}

          {repairability.class && (
            <InfoRowCard
              title="Repairability"
              details={
                <>
                  Class: {repairability.class} <br />
                  Guaranteed updates (years):{" "}
                  {repairability.guaranteedUpdates_years} <br />
                  Index: {repairability.index}
                </>
              }
              status={
                ["A", "B"].includes(repairability.class)
                  ? "success"
                  : repairability.class === "C"
                  ? "warning"
                  : "danger"
              }
              iconStatus={
                ["A", "B"].includes(repairability.class)
                  ? "success"
                  : repairability.class === "C"
                  ? "warning"
                  : "danger"
              }
              style={{ marginBottom: 10 }}
            />
          )}

          {warranty.duration_months && (
            <InfoRowCard
              title="Warranty"
              details={<>Warranty: {warranty.duration_months} Monate</>}
              status="success"
              iconStatus="success"
              style={{ marginBottom: 10 }}
            />
          )}
        </CardContent>
      )}
    </Card>
  );
};

export default LongtivitySection;
