import React, { useState } from "react";
import FlowCanvas from "./components/FlowCanvas";
import SideBar from "./components/SideBar";
import FormRequest from "./components/FormRequest";

export default function App() {
  const [show, setShow] = useState(false)
  const [nodes, setNodes] = useState([])
  const [edge, setEdge] = useState([])

  function addNode(tableName, columns){
    setNodes((nds)=> nds.concat({
        id: `${nds.length + 1}`,
        position: { x: (Math.random() * 400), y: (Math.random() * 400)},
        type: 'table',
        data: {
            TableName: tableName,
            columns: [
              columns.map((col) =>{
                return {
                  name: col.name,
                  type: col.type,
                  nullable: col.nullable
                }
              })
            ]
        }
    }))
  }

  console.log(nodes)


  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar  show={show}  setShow={setShow} />
      <FlowCanvas nodes={nodes} setNodes={setNodes} edge={edge} setEdge={setEdge} />
      { show && <FormRequest onClose={()=> setShow(false)} onSubmit={(tableName) =>{
        // addNode(tableName, columns)
        setShow(false)
      }} />}
    </div>
  );
}