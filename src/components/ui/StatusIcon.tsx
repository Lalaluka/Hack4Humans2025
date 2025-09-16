import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

export type StatusType = 'success' | 'warning' | 'danger';

interface StatusIconProps {
  status: StatusType;
}

const iconMap = {
  success: <Check size={24} color="#388e3c" />,
  warning: <AlertTriangle size={24} color="#eab308" />,
  danger: <X size={24} color="#d32f2f" />,
};

const StatusIcon: React.FC<StatusIconProps> = ({ status }) => (
  <span style={{ marginLeft: 8 }}>{iconMap[status]}</span>
);

export default StatusIcon;
