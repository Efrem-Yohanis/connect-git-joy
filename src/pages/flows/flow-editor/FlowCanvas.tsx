import React, { useState, useCallback, useEffect } from 'react';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeService } from '@/services/nodeService';
import { toast } from 'sonner';

// Import node types
import { SftpCollectorNode } from './nodes/SftpCollectorNode';
import { FdcNode } from './nodes/FdcNode';
import { Asn1DecoderNode } from './nodes/Asn1DecoderNode';
import { AsciiDecoderNode } from './nodes/AsciiDecoderNode';
import { ValidationBlnNode } from './nodes/ValidationBlnNode';
import { EnrichmentBlnNode } from './nodes/EnrichmentBlnNode';
import { EncoderNode } from './nodes/EncoderNode';
import { DiameterInterfaceNode } from './nodes/DiameterInterfaceNode';
import { RawBackupNode } from './nodes/RawBackupNode';

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
};

interface FlowCanvasProps {
  selectedNodeType: string | null;
  onNodeSelect: (node: Node | null) => void;
  selectedNode: Node | null;
}

export function FlowCanvas({ selectedNodeType, onNodeSelect, selectedNode }: FlowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [apiNodes, setApiNodes] = useState<any[]>([]);

  // Fetch nodes from API
  useEffect(() => {
    const fetchNodes = async () => {
      try {
        setLoading(true);
        console.log('🚀 Starting to fetch nodes from API...');
        const apiNodesData = await nodeService.getAllNodes();
        console.log('📦 API Nodes Data:', apiNodesData);
        setApiNodes(apiNodesData);
        
        // Convert API nodes to React Flow nodes
        const flowNodes = apiNodesData.map((apiNode, index) => {
          const nodeType = determineNodeType(apiNode.name);
          console.log(`🔍 Processing node ${apiNode.name} as type: ${nodeType}`);
          
          // Get active version data
          const activeVersionData = apiNode.active_version !== null 
            ? apiNode.versions.find(v => v.version === apiNode.active_version)
            : apiNode.versions[0]; // Fall back to first version if no active version
          
          return {
            id: apiNode.id,
            type: nodeType,
            position: { x: 100 + index * 250, y: 100 + (index % 3) * 150 },
            data: {
              label: apiNode.name,
              description: apiNode.description,
              nodeId: apiNode.id,
              active_version: apiNode.active_version,
              total_versions: apiNode.total_versions,
              subnodes: activeVersionData?.subnodes || [],
              parameters: activeVersionData?.parameters || [],
              deployed: activeVersionData?.is_deployed || false,
            },
          };
        });

        console.log('🎯 Generated Flow Nodes:', flowNodes);
        setNodes(flowNodes);
      } catch (error) {
        console.error('❌ Error fetching nodes:', error);
        toast.error('Failed to load nodes from API');
      } finally {
        setLoading(false);
      }
    };

    fetchNodes();
  }, [setNodes]);

  // Helper function to determine node type based on name or other criteria
  const determineNodeType = (nodeName: string): string => {
    const name = nodeName.toLowerCase();
    if (name.includes('sftp') || name.includes('collector')) return 'sftp_collector';
    if (name.includes('fdc')) return 'fdc';
    if (name.includes('asn1') || name.includes('decoder')) return 'asn1_decoder';
    if (name.includes('ascii')) return 'ascii_decoder';
    if (name.includes('validation')) return 'validation_bln';
    if (name.includes('enrichment')) return 'enrichment_bln';
    if (name.includes('encoder')) return 'encoder';
    if (name.includes('diameter')) return 'diameter_interface';
    if (name.includes('backup')) return 'raw_backup';
    return 'sftp_collector'; // default fallback
  };

  const onConnect = useCallback(
    (params: Connection) => {
      console.log('🔗 Connecting nodes:', params);
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges],
  );

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      console.log('👆 Node clicked:', node);
      onNodeSelect(node);
    },
    [onNodeSelect],
  );

  const onPaneClick = useCallback(() => {
    onNodeSelect(null);
  }, [onNodeSelect]);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading nodes from API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        className="bg-background"
        fitView
        fitViewOptions={{
          padding: 0.2,
        }}
      >
        <Controls className="bg-card border-border" />
        <MiniMap 
          className="bg-card border-border" 
          nodeColor="#8b5cf6"
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Background 
          variant={BackgroundVariant.Dots} 
          gap={20} 
          size={1} 
          className="opacity-30" 
        />
      </ReactFlow>
    </div>
  );
}
