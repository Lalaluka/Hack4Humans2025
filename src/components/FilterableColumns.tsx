import React, { useState } from "react";
import ColumnFilterDropdown from "./ColumnFilterDropdown";
import ToxicityAccordion from "./ToxicityAccordion";
import TrafficSign from "./ui/TrafficSign";
import LongtivitySection from "./LongtivitySection";
import type { ToxicityAccordionItem } from "./ToxicityAccordion";

export type FilterableColumn = {
  key: string;
  label: string;
  image: string;
  data: ToxicityAccordionItem[];
  longtivityData?: any;
};

export type FilterableColumnsProps = {
  columns: FilterableColumn[];
};

const FilterableColumns: React.FC<FilterableColumnsProps> = ({ columns }) => {
  const [visible, setVisible] = useState(columns.map(() => true));
  const [open, setOpen] = useState(false);

  function toggleColumn(idx: number) {
    setVisible((v) => v.map((val, i) => (i === idx ? !val : val)));
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <ColumnFilterDropdown
          columns={columns}
          visible={visible}
          toggleColumn={toggleColumn}
          open={open}
          setOpen={setOpen}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "stretch",
          width: "100%",
        }}
      >
        {columns.map(
          (col, idx) =>
            visible[idx] && (
              <div key={col.key} style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <img
                    src={col.image}
                    alt={col.label}
                    style={{ width: 120, borderRadius: 8 }}
                  />
                  <TrafficSign />
                </div>
                <h2 className="text-xl font-semibold mb-2 text-center">
                  {col.label}
                </h2>
                {col.data && col.data.length > 0 && (
                  <ToxicityAccordion items={col.data} title="Toxicity Data" />
                )}
                <LongtivitySection longtivityData={col.longtivityData} />
              </div>
            )
        )}
      </div>
    </>
  );
};

export default FilterableColumns;
