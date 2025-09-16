import React from 'react';

export type CardStatus = 'success' | 'warning' | 'danger';

interface CardProps {
  status: CardStatus;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const statusStyles: Record<CardStatus, { bg: string; border: string }> = {
  success: { bg: '#f6fff6', border: '#b6e6a3' },
  warning: { bg: '#fffbe6', border: '#ffe58f' },
  danger: { bg: '#fff6f6', border: '#fbb6b6' },
};

const Card: React.FC<CardProps> = ({ status, children, style }) => {
  const { bg, border } = statusStyles[status];
  return (
    <div
      style={{
        borderRadius: 8,
        background: bg,
        border: `1px solid ${border}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        width: 500,
        margin: '0 auto',
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Card;
