import React, { useState } from 'react';
import { Filter, CheckSquare, Square } from 'lucide-react';
import { Button } from './button';
import type { FilterableColumn } from './FilterableColumns';

interface Props {
  columns: FilterableColumn[];
  visible: boolean[];
  toggleColumn: (idx: number) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ColumnFilterDropdown: React.FC<Props> = ({ columns, visible, toggleColumn, open, setOpen }) => {
  return (
    <div style={{ position: 'relative' }}>
      <Button variant="outline" size="sm" onClick={() => setOpen(!open)} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Filter size={18} />
        Filter Products to compare
      </Button>
      {open && (
        <div style={{ position: 'absolute', left: 0, top: '110%', background: '#fff', border: '1px solid #eee', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', padding: '1rem', zIndex: 10, minWidth: 160 }}>
          {columns.map((col, idx) => (
            <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, cursor: 'pointer', fontSize: 16, fontWeight: 600, color: '#111' }}>
              <span onClick={() => toggleColumn(idx)} style={{ display: 'flex', alignItems: 'center' }}>
                {visible[idx] ? <CheckSquare size={18} color="#222" /> : <Square size={18} color="#888" />}
              </span>
              <span style={{ color: '#111', fontWeight: 600 }}>{col.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColumnFilterDropdown;
