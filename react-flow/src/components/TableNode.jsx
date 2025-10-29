import React from "react";
import { Handle, Position } from "@xyflow/react";

export default function TableNode({ data }) {
  const { TableName, columns } = data;

  const randomColor = React.useMemo(() => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 60%, 35%)`; // warna agak gelap, kontras dengan teks putih
  }, []);

  return (
    <div
      style={{
        border: "1px solid #94a3b8",
        borderRadius: "6px",
        background: "white",
        minWidth: 180,
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          background: randomColor,
          color: "white",
          padding: "6px 10px",
          fontWeight: "bold",
          borderTopLeftRadius: "6px",
          borderTopRightRadius: "6px",
        }}
      >
        {TableName}
      </div>

      <div style={{ padding: "8px 10px" }}>
        {columns.map((col, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.85rem",
              borderBottom: "1px dashed #e2e8f0",
              padding: "2px 0",
            }}
          >
            <span>{col.name}</span>
            <span style={{ color: "#64748b" }}>{col.type}</span>
          </div>
        ))}
      </div>

      {/* handle untuk menghubungkan relasi antar tabel */}
      <Handle type="target" position={Position.Left} style={{ background: "#1e293b" }} />
      <Handle type="source" position={Position.Right} style={{ background: "#1e293b" }} />
    </div>
  );
}
