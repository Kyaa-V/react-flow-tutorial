// CustomEdge.jsx - GARIS STEP/CUSTOM DENGAN EDIT LABEL
import {
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
  useReactFlow,
  useInternalNode,
} from "@xyflow/react";
import { useState } from "react";
// import { getEdgeParams } from './utils';

export function CustomEdge({
  id,
  // source,
  // target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  borderRadius,
  style,
  selected,
  // sourceHandleId,
  // targetHandleId,
  markerEnd
}) {
  const { setEdges } = useReactFlow();
  const [isEditing, setIsEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(data?.label || "");

  // const sourceNode = useInternalNode(source);
  // const targetNode = useInternalNode(target);

  // if (
  //   !sourceNode ||
  //   !targetNode ||
  //   !sourceNode.measured ||
  //   !targetNode.measured
  // ) {
  //   return null; // Jangan render edge jika node belum diukur
  // }

  // console.log('sourceHandle:', sourceHandleId)
  // console.log('targetHandle:', targetHandleId)
  // const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
  //   sourceNode,
  //   targetNode,
  //   sourceHandleId,
  //   targetHandleId
  // );

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
    borderRadius,
  });

  const handleLabelClick = (event) => {
    event.stopPropagation();
    setIsEditing(true);
    setEditedLabel(data?.label || "");
  };

  const handleSaveEdit = () => {
    setIsEditing(false);

    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              label: editedLabel,
            },
          };
        }
        return edge;
      })
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedLabel(data?.label || "");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSaveEdit();
    } else if (event.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <>
      {/* GARIS UTAMA */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          stroke: selected ? "#4f46e5" : "#6366f1",
          strokeWidth: selected ? 3.5 : 2.5,
          strokeLinecap: "round",
        }}
      />
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        strokeWidth={5}
        markerEnd={markerEnd}
        style={style}
      />

      {/* LABEL YANG BISA DI EDIT */}
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            fontWeight: 600,
            background: data?.labelBackground || "white",
            color: data?.labelColor || "#374151",
            padding: "2px 8px",
            borderRadius: 4,
            border: `1px solid ${selected ? "#4f46e5" : "#d1d5db"}`,
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            pointerEvents: "all",
            zIndex: 1000,
            minWidth: 60,
            minHeight: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          className="edge-label"
          onClick={handleLabelClick}
        >
          {isEditing ? (
            <input
              type="text"
              value={editedLabel}
              onChange={(e) => setEditedLabel(e.target.value)}
              onBlur={handleSaveEdit}
              onKeyDown={handleKeyPress}
              autoFocus
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 12,
                fontWeight: 600,
                color: data?.labelColor || "#374151",
                width: "100%",
                textAlign: "center",
                padding: 0,
                margin: 0,
              }}
            />
          ) : (
            <span
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 150,
              }}
            >
              {data?.label || "Klik untuk edit"}
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
