import React, { useEffect, useState, useCallback } from "react";
import FlowCanvas from "./components/FlowCanvas";
import SideBar from "./components/SideBar";
import FormRequest from "./components/FormRequest";
import { useEdgesState, useNodesState } from "@xyflow/react";
import debounce from "lodash.debounce";

export default function App() {
  const [show, setShow] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edge, setEdge, onEdgesChange] = useEdgesState([]);

  const saveToLocalStorage = useCallback(
    debounce((nodes, edges) => {
      localStorage.setItem("nodes", JSON.stringify(nodes));
      localStorage.setItem("edges", JSON.stringify(edges));
      console.log("✅ Saved to localStorage");
    }, 500),
    []
  );

  useEffect(() => {
    if (nodes.length > 0 || edge.length > 0) {
      saveToLocalStorage(nodes, edge);
    }
  }, [nodes, edge, saveToLocalStorage]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.returnValue = true; // Harus set agar browser menampilkan konfirmasi default
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []); 

  useEffect(() => {
    const getNode = localStorage.getItem("nodes");
    const getEdge = localStorage.getItem("edges");

    if (getNode && getEdge) {
      // console.log(getNode, getEdge);
      setNodes(JSON.parse(getNode));
      setEdge(JSON.parse(getEdge));
    }
  }, [setNodes, setEdge]);

    const onEdit = useCallback((nodeId, updatedData) => {
    console.log('Editing node:', nodeId, updatedData);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updatedData
            }
          };
        }
        return node;
      })
    );
  }, [setNodes]);

  
  const onDelete = useCallback((nodeId) => {
    console.log('Deleting node:', nodeId);
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    localStorage.removeItem("nodes")
    localStorage.setItem("nodes", JSON.stringify(nodes))
    // console.log(nodeSave)
  }, [setNodes]);

  // Pass callbacks to all nodes
  const nodesWithCallbacks = nodes.map(node => ({
    ...node,
    data: {
      ...node.data,
      onEdit,
      onDelete
    }
  }));

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
        nodes={nodesWithCallbacks}
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
