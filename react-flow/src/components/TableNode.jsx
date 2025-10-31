// TableNode.jsx
import React from "react";
import { Handle, NodeResizer, Position } from "@xyflow/react";

export default function TableNode({ data }) {
  const { TableName, columns } = data;

  const randomColor = React.useMemo(() => {
      const hue = Math.floor(Math.random() * 360);
      return `hsl(${hue}, 60%, 35%)`;
    }, []);
  return (
    <div
      style={{
        border: "1px solid #94a3b8",
        borderRadius: "6px",
        background: "white",
        minWidth: 150,
        padding: "8px",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          background: randomColor,
          color: "white",
          padding: "6px",
          fontWeight: "bold",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
      >
        {TableName}
      </div>
      <div style={{paddingTop: "4px"}}>
        {columns.map((col, idx) => {
          const sourceHandleId = `${TableName}_${col.name}_source`;
          const targetHandleId = `${TableName}_${col.name}_target`;
          const rowHeight = 30; // Tinggi baris (sesuaikan dengan CSS)
          const topOffset = (idx * rowHeight + rowHeight) + 10;

          return (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "4px 8px",
                borderBottom: "1px dashed #e2e8f0",
              }}
            >
              <Handle
                type="target"
                position={Position.Left}
                id={targetHandleId}
                style={{
                  top: topOffset,
                  position: "absolute",
                  transform: "translateX(-50%)",
                  background: "#ef4444",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                }}
              />
              <span style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <strong>{col.name}</strong>
                <span> ({col.type})</span>
              </span>
              <Handle
                type="source"
                position={Position.Right}
                id={sourceHandleId}
                style={{
                  top: topOffset,
                  position: "absolute",
                  transform: "translateX(50%)",
                  background: "#10b981",
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}