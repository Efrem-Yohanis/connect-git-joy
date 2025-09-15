import React, { useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Import the same node types as the flow editor
import { SftpCollectorNode } from '../flow-editor/nodes/SftpCollectorNode';
import { FdcNode } from '../flow-editor/nodes/FdcNode';
import { Asn1DecoderNode } from '../flow-editor/nodes/Asn1DecoderNode';
import { AsciiDecoderNode } from '../flow-editor/nodes/AsciiDecoderNode';
import { ValidationBlnNode } from '../flow-editor/nodes/ValidationBlnNode';
import { EnrichmentBlnNode } from '../flow-editor/nodes/EnrichmentBlnNode';
import { EncoderNode } from '../flow-editor/nodes/EncoderNode';
import { DiameterInterfaceNode } from '../flow-editor/nodes/DiameterInterfaceNode';
import { RawBackupNode } from '../flow-editor/nodes/RawBackupNode';

// Generic node component for unknown node types
const GenericNode = ({ data }) => (
  <div className="px-4 py-3 bg-card border border-border shadow-sm min-w-[200px]">
    <Handle
      type="target"
      position={Position.Left}
      className="w-3 h-3 bg-primary border-2 border-background"
    />
    <div className="font-semibold text-sm text-foreground mb-1">
      {data.label || data.node?.name || 'Unknown Node'}
    </div>
    {data.description && (
      <div className="text-xs text-muted-foreground mb-2">
        {data.description}
      </div>
    )}
    {data.selected_subnode && (
      <div className="text-xs text-muted-foreground">
        Subnode: {data.selected_subnode.name}
      </div>
    )}
    <Handle
      type="source"
      position={Position.Right}
      className="w-3 h-3 bg-primary border-2 border-background"
    />
  </div>
);

const nodeTypes = {
  sftp_collector: SftpCollectorNode,
  fdc: FdcNode,
  asn1_decoder: Asn1DecoderNode,
  ascii_decoder: AsciiDecoderNode,
  validation_bln: ValidationBlnNode,
  enrichment_bln: EnrichmentBlnNode,
  encoder: EncoderNode,
  diameter_interface: DiameterInterfaceNode,
  raw_backup: RawBackupNode,
  generic: GenericNode,
};

interface FlowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodeSelect: (node: Node | null) => void;
}

export function FlowCanvas({ nodes, edges, onNodeSelect }: FlowCanvasProps) {
  const [nodeList, setNodes, onNodesChange] = useNodesState(nodes);
  const [edgeList, setEdges, onEdgesChange] = useEdgesState(edges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges(eds => addEdge(params, eds)),
    [setEdges],
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      onNodeSelect(node);
    },
    [onNodeSelect]
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  return (
    <div className="w-full h-full bg-canvas-background">
      <ReactFlow
        nodes={nodeList}
        edges={edgeList}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        className="bg-canvas-background"
        style={{
          backgroundColor: 'hsl(var(--canvas-background))',
        }}
      >
        <Controls 
          className="bg-card border-border"
          showZoom={true}
          showFitView={true}
        />
        <MiniMap 
          className="bg-card border-border"
          maskColor="hsl(var(--canvas-background) / 0.8)"
          nodeColor="hsl(var(--primary))"
          nodeStrokeWidth={2}
        />
        <Background 
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="hsl(var(--canvas-grid))"
        />
      </ReactFlow>
    </div>
  );
}