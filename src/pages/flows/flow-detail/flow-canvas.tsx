import { useCallback } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    position: { x: 250, y: 5 },
    data: { 
      label: 'Loan Request Node',
      status: 'deployed'
    },
    style: {
      border: '2px solid #10b981',
      borderRadius: '8px'
    }
  },
  {
    id: '2',
    type: 'default',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Validation Node',
      status: 'deployed'
    },
    style: {
      border: '2px solid #10b981',
      borderRadius: '8px'
    }
  },
  {
    id: '3',
    type: 'default',
    position: { x: 400, y: 100 },
    data: { 
      label: 'SMS Processing',
      status: 'not_deployed'
    },
    style: {
      border: '2px solid #ef4444',
      borderRadius: '8px'
    }
  },
  {
    id: '4',
    type: 'default',
    position: { x: 250, y: 200 },
    data: { 
      label: 'Response Node',
      status: 'deployed'
    },
    style: {
      border: '2px solid #10b981',
      borderRadius: '8px'
    }
  }
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    type: 'smoothstep',
    label: 'data_flow',
    style: { stroke: '#6366f1', strokeWidth: 2 }
  },
  {
    id: 'e1-3',
    source: '1',
    target: '3',
    type: 'smoothstep',
    label: 'control',
    style: { stroke: '#6366f1', strokeWidth: 2 }
  },
  {
    id: 'e2-4',
    source: '2',
    target: '4',
    type: 'smoothstep',
    label: 'data_flow',
    style: { stroke: '#6366f1', strokeWidth: 2 }
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    type: 'smoothstep',
    label: 'data_flow',
    style: { stroke: '#6366f1', strokeWidth: 2 }
  }
];

interface FlowCanvasProps {
  readOnly?: boolean;
}

export function FlowCanvas({ readOnly = false }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        fitView
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
      >
        <Controls />
        <MiniMap />
        <Background />
      </ReactFlow>
    </div>
  );
}