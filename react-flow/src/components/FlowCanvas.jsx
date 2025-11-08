import { useState, useCallback, useEffect } from "react";
import {
  ReactFlow,
  Position,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  useNodes,
  ControlButton,
  Panel,
  useNodesState,
  useEdgesState,
  ConnectionMode,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CustomEdge } from "../CustomEdge";
import TableNode from "./TableNode";

const nodeTypes = {
  table: TableNode,
};
const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  {
    id: "users",
    position: { x: 0, y: 0 },
    type: "table",
    data: {
      TableName: "users",
      columns: [
        { name: "id", type: "INT (PK)" },
        { name: "username", type: "VARCHAR" },
        { name: "email", type: "VARCHAR" },
      ],
    },
  },
  {
    id: "product_items",
    position: { x: 400, y: 100 },
    type: "table",
    data: {
      TableName: "product_items",
      columns: [
        { name: "id", type: "INT (PK)" },
        { name: "users_id", type: "INT (FK)" },
        { name: "product_id", type: "INT (FK)" },
        { name: "quantity", type: "INT" },
      ],
    },
  },
  {
    id: "items",
    position: { x: 800, y: 0 },
    type: "table",
    data: {
      TableName: "items",
      columns: [
        { name: "id", type: "INT (PK)" },
        { name: "name", type: "VARCHAR" },
        { name: "price", type: "DECIMAL" },
      ],
    },
  },
];
const initialEdges = [];

export default function App({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
}) {
  const [variantBackground, setVariantBackground] = useState("cross");

  // useEffect(() => {
  //   console.log('NODES:', nodes);
  //   console.log('EDGES (Relasi):', edges);
  // }, [nodes, edges]);

  const onConnect = useCallback(
    (params) => {
      console.log("onconnect", params);
      const newEdge = {
        ...params,
        type: "custom-edge",
        animated: true,
        data: { label: "1:N" }, // Opsional: Tambah label relasi
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const isValidConecction = (connection) => {
    const { sourceHandle, targetHandle } = connection;

    console.log(connection);

    console.log(`sourceHandle: ${sourceHandle}, targetHandle ${targetHandle}`);

    const splitSourceHandle = sourceHandle.split("_");
    const splitTargetHandle = targetHandle.split("_");
    console.log(`splitSourceHadle ${splitSourceHandle}`);
    console.log(`splitTargetHadle ${splitTargetHandle}`);

    const sourcePattern = splitSourceHandle.slice(0, 2).join("_"); // users_id
    const targetPattern = splitTargetHandle.slice(0, 2).join("_"); // product_items

    console.log(`sourcePattern: ${sourcePattern}`);
    console.log(`targetPattern: ${targetPattern}`);

    const directMatch = targetHandle.includes(sourcePattern);
    const reverseMatch = sourceHandle.includes(targetPattern);

    console.log(`directMatch: ${directMatch}, reverseMatch: ${reverseMatch}`);

    return directMatch || reverseMatch
    // return splitSourceHandle[0] === splitTargetHandle[2] && splitSourceHandle[] === splitTargetHandle[1]
  };

  const edgeTypes = {
    "custom-edge": CustomEdge,
  };

  // const createRelationship = useCallback((sourceTable, sourceCol, targetTable, targetCol) => {
  //     const newEdge = {
  //       id: `${sourceTable}_${sourceCol}-to-${targetTable}_${targetCol}`,
  //       source: sourceTable,
  //       target: targetTable,
  //       sourceHandle: `${sourceTable}_${sourceCol}_source`,
  //       targetHandle: `${targetTable}_${targetCol}_target`,
  //       type: 'custom-edge',
  //       animated: true,
  //     };
  //     setEdges((eds) => addEdge(newEdge, eds));
  //   }, [setEdges]);

  function NodeColor(node) {
    switch (node.type) {
      case "input":
        return "red";
      case "output":
        return "green";
      case "table":
        return "blue";
      case "default":
        return "blue";
    }
  }

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          colorMode="white"
          connectionMode={ConnectionMode.Loose}
          isValidConnection={isValidConecction}
        >
          <Background variant={variantBackground} />
          <Controls />
          <MiniMap
            position="top-right"
            pannable
            zoomable
            nodeColor={NodeColor}
          />
          {/* <Panel position="top-left">top-left</Panel>
        <Panel position="top-center">top-center</Panel>
        <Panel position="top-right">top-right</Panel>
        <Panel position="bottom-left">bottom-left</Panel>
        <Panel position="bottom-center">bottom-center</Panel>
        <Panel position="bottom-right">bottom-right</Panel>
        <Panel position="center-left">center-left</Panel>
          <Panel position="center-right">center-right</Panel> */}
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
