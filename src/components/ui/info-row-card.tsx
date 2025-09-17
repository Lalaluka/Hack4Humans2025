import React from "react";
import { Card } from "./card";
import StatusIcon from "./StatusIcon";
type CardStatus = "success" | "warning" | "danger";
import type { StatusType } from "./StatusIcon";

interface InfoRowCardProps {
  title: string;
  details: React.ReactNode;
  status: CardStatus;
  iconStatus?: StatusType;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

const InfoRowCard: React.FC<InfoRowCardProps> = ({
  title,
  details,
  status,
  iconStatus,
  style,
  children,
}) => (
  <Card
    status={status}
    style={{ padding: "0.8rem 1.2rem", color: "#222", ...style }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <strong>{title}</strong>
        <br />
        {details}
        {children}
      </div>
      {iconStatus && <StatusIcon status={iconStatus} />}
    </div>
  </Card>
);

export default InfoRowCard;
