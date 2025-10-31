  import React, { useState } from "react";
  import FlowCanvas from "./components/FlowCanvas";
  import SideBar from "./components/SideBar";
  import FormRequest from "./components/FormRequest";
import { useEdgesState, useNodesState } from "@xyflow/react";

  export default function App() {
    const [show, setShow] = useState(false)
    const [nodes, setNodes, onNodesChange] = useNodesState([])
    const [edge, setEdge, onEdgesChange] = useEdgesState([])

    function addNode(data){
      setNodes((nds)=> nds.concat({
          id: `${nds.length + 1}`,
          position: { x: Math.random() * 400 ,y: Math.random() * 400 },
          type: 'table',
          data: {
              TableName: data.tableName,
              columns:data.columns.map((col) =>{
                  return {
                    name: col.name,
                    type: col.type,
                    nullable: col.nullable
                  }
                })
          }
      }))
    }


    return (
      <div style={{ display: "flex", height: "100vh" }}>
        <SideBar  show={show}  setShow={setShow} />
        <FlowCanvas 
          nodes={nodes}
          edges={edge}
          onNodesChange={onNodesChange}   // Kirim handler
          onEdgesChange={onEdgesChange}   // Kirim handler
          setNodes={setNodes}
          setEdges={setEdge} />
        { show && <FormRequest onClose={()=> setShow(false)} onSubmit={(data) =>{
          addNode(data)
          console.log(data)
          console.log(data.tableName)
          console.log(data.columns)
          setShow(false)
        }} />}
      </div>
    );
  }