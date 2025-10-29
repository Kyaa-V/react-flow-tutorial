import { useState, useCallback } from 'react';
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
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { TextUpdaterNode } from './TextUpdater';
import { CustomEdge } from './CustomEdge';


const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'User' }, type: 'input', ...nodeDefaults },
  { id: '2', position: { x: 100, y: 150 }, data: { label: 'ProductItems' }, type: 'default', ...nodeDefaults },
  { id: '3', position: { x:-200, y:-200 }, data: { label: 'Items' }, type: 'output', ...nodeDefaults}
];
const initialEdges = [
  { id: 'e1-n2', source: '1', target: '2', type: 'step', label: 'm to n', animated: true },
  { id: 'e2-n3', source: '2', target: '3', type: 'smoothstep', label: 'n to m'}
]
 
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [ variantBackground, setVariantBackground] = useState('cross')
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  // const onEdgesChange = useCallback(
  //   (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
  //   [],
  // );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  const edgeTypes = {
    'custom-edge' : CustomEdge
  }

  function NodeColor(node){
    switch (node.type){
      case 'input':
        return 'red';
      case 'output':
        return 'green';
      case 'default':
        return 'blue';
    }
  }

  function Sidebar() {
    // This hook will only work if the component it's used in is a child of a
    // <ReactFlowProvider />.
    const nodes = useNodes()
  
    return (
      <aside>
        {nodes.map((node) => (
          <div key={node.id}>
            Node {node.id} -
              x: {node.position.x.toFixed(2)},
              y: {node.position.y.toFixed(2)}
          </div>
        ))}
      </aside>
    )
  }
   

 
  return (
    <div style={{ width: '100vw', height: '100vh'}}>
      <ReactFlowProvider>
        <ReactFlow
        nodes={nodes}
        edges={edges}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        // onEdgesChange={onEdgesChange}
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
      {/* <Sidebar/> */}
      </ReactFlowProvider>
    </div>
  );
}