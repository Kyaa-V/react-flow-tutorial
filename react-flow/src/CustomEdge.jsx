// CustomEdge.jsx - GARIS STEP/CUSTOM
import { BaseEdge, getSmoothStepPath, getStraightPath,EdgeLabelRenderer, useReactFlow } from '@xyflow/react';

export function CustomEdge({ id, sourceX, sourceY, targetX, targetY, data }) {
  const { setEdges } = useReactFlow();

  // ✅ GARIS LURUS ELEGANT (Bukan Bezier jelek!)
  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      {/* GARIS UTAMA */}
      <BaseEdge 
        path={edgePath} 
        style={{ 
          stroke: '#6366f1', 
          strokeWidth: 2.5,
          strokeLinecap: 'round'
        }} 
      />
      
      {/* PANAH */}
      <BaseEdge 
        path={edgePath} 
        style={{ 
          stroke: '#8b5cf6', 
          strokeWidth: 1,
          strokeLinecap: 'round'
        }} 
      />
    </>
  );
}