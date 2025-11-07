
import { Position } from '@xyflow/react';

// Fungsi baru: Cari handle by ID dan ambil koordinatnya
function getHandleCoordsById(node, handleId, handleType = 'source') {
  const bounds = node.internals?.handleBounds?.[handleType];
  
  if (!bounds || bounds.length === 0) {
    // Fallback jika handle belum diukur
    return [
      node.internals.positionAbsolute.x + (node.measured?.width || 0) / 2,
      node.internals.positionAbsolute.y + (node.measured?.height || 0) / 2,
    ];
  }

  const handle = bounds.find(h => h.id === handleId);
  
  if (!handle) {
    // Fallback ke center node jika handle ID tidak ditemukan
    console.warn(`Handle ID ${handleId} not found in ${handleType} bounds`);
    return [
      node.internals.positionAbsolute.x + (node.measured?.width || 0) / 2,
      node.internals.positionAbsolute.y + (node.measured?.height || 0) / 2,
    ];
  }

  // Hitung offset berdasarkan posisi handle (fixed dari definisi Handle)
  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  switch (handle.position) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
    default:
      break;
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y, handle.position]; // Kembalikan juga position asli handle
}

// Fungsi center tetap sama (dengan fallback)
function getNodeCenter(node) {
  const width = node.measured?.width ?? 0;
  const height = node.measured?.height ?? 0;
  return {
    x: node.internals.positionAbsolute.x + width / 2,
    y: node.internals.positionAbsolute.y + height / 2,
  };
}

// Export: getEdgeParams sekarang gunakan handle ID dari edge params
export function getEdgeParams(sourceNode, targetNode, sourceHandleId, targetHandleId) {
  if (!sourceNode || !targetNode) {
    return { sx: 0, sy: 0, tx: 0, ty: 0, sourcePos: Position.Right, targetPos: Position.Left };
  }

  const [sx, sy, sourcePos] = getHandleCoordsById(sourceNode, sourceHandleId, 'source');
  const [tx, ty, targetPos] = getHandleCoordsById(targetNode, targetHandleId, 'target');

  return { sx, sy, tx, ty, sourcePos, targetPos };
}