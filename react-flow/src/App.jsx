import React, { useState } from "react";
import FlowCanvas from "./components/FlowCanvas";
import SideBar from "./components/SideBar";
import FormRequest from "./components/FormRequest";
import { useEdgesState, useNodesState } from "@xyflow/react";

export default function App() {
  const [show, setShow] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edge, setEdge, onEdgesChange] = useEdgesState([]);

  function addNode(data) {
    const newNodes = data.tableName.map((table, index) => {
      const tableColumns = data.columns[index] || [];

      return {
        id: `${Date.now()}-${index}`,
        position: {
          x: Math.random() * 400,
          y: Math.random() * 400,
        },
        type: "table",
        data: {
          TableName: table.name,
          columns: tableColumns.map((column) => ({
            name: column.name,
            type: column.type,
            index: column.index,
            nullable: column.nullable,
          })),
        },
      };
    });

    setNodes((nds) => [...nds, ...newNodes]);
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar show={show} setShow={setShow} />
      <FlowCanvas
        nodes={nodes}
        edges={edge}
        onNodesChange={onNodesChange} // Kirim handler
        onEdgesChange={onEdgesChange} // Kirim handler
        setNodes={setNodes}
        setEdges={setEdge}
      />
      {show && (
        <FormRequest
          nodes={nodes}
          onClose={() => setShow(false)}
          onSubmit={(data) => {
            addNode(data);
            setShow(false);
          }}
        />
      )}
    </div>
  );
}
