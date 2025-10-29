import { useState, useCallback, useEffect } from 'react';
import { ReactFlow,
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
  useEdgesState
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { CustomEdge } from '../CustomEdge';
import TableNode from './TableNode';


const nodeTypes= {
    table: TableNode
}
const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  {
    id: '1',
    position: { x: 0, y: 0 }, 
    type: 'table',
    data: { 
        TableName: 'User',
        columns: [
            {name: 'id', type: 'INT (PK)'},
            {name: 'username', type: 'VARCHAR'},
            {name: 'email', type: 'VARCHAR'},
            {name: 'password', type: 'VARCHAR'},
        ]
     },
  },
  {
    id: '2',
    position: { x: 400, y: 200 }, 
    type: 'table',
    data: { 
        TableName: 'access_token',
        columns: [
            {name: 'id', type: 'INT (PK)'},
            {name: 'token', type: 'VARCHAR'},
            {name: 'exp_at', type: 'VARCHAR'},
            {name: 'isp_at', type: 'VARCHAR'},
            {name: 'created_at', type: 'TIME_STAMP'},
        ]
     },
  },
  {
    id: '3',
    position: { x: 100, y: 100 }, 
    type: 'table',
    data: {
        TableName: 'reset_password',
        columns: [
            {name: 'id', type: 'INT (PK)'},
            {name: 'email', type: 'VARCHAR'},
            {name: 'token', type: 'VARCHAR'},
        ]
    },
  },
];
const initialEdges = [
  { id: 'e1-n2', source: '1', target: '2', type: 'step', label: 'm to n', animated: true },
  { id: 'e2-n3', source: '2', target: '3', type: 'smoothstep', label: 'n to m'}
]
 
export default function App({ nodes: externalNodes, setNodes, edge: externalEdges, setEdge}) {
  const [nodes, setNodesState, onNodesChange] = useNodesState(externalNodes || initialNodes);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(externalEdges || initialEdges);
  const [ variantBackground, setVariantBackground] = useState('cross')

  useEffect(() => {
    if (externalNodes) {
      setNodesState(externalNodes);
    }
  }, [externalNodes, setNodesState]);

  useEffect(() => { 
    if (externalEdges) {
      setEdgesState(externalEdges);
    }
  }, [externalEdges, setEdgesState]);

 
  const onConnect = useCallback((params) => {
    const newEdges = addEdge(params, edges)

    setEdgesState(newEdges)

    if(setEdge) setEdge(newEdges)
  },[edges, setEdge, setEdgesState])

  const edgeTypes = {
    'custom-edge' : CustomEdge
  }

  // function addNode(tableName){
  //   setNodes((nds)=> nds.concat({
  //       id: (nds.length + 1).toString,
  //       position: { x: (Math.random() * 400), y: (Math.random() * 400)},
  //       type: 'table',
  //       data: {
  //           TableName: tableName,
  //           columns: [
  //               {name: 'id', type: 'INT (PK)'},
  //               {name: 'created_at', type: 'TIME_STAMP'}
  //           ]
  //       }
  //   }))
  // }


  function NodeColor(node){
    switch (node.type){
      case 'input':
        return 'red';
      case 'output':
        return 'green';
      case 'table':
        return 'blue';
      case 'default':
        return 'blue';
    }
  }

 
  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <ReactFlowProvider>
        <ReactFlow
        nodes={nodes}
        edges={edges} 
        edgeTypes={edgeTypes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode='white'
        fitView
      > 
        <Background variant= {variantBackground}/>
        <Controls/>
        <MiniMap position="top-right" pannable zoomable nodeColor={NodeColor}/>
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