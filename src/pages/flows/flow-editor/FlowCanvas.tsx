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
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeService } from '@/services/nodeService';
import { flowService } from '@/services/flowService';
import { toast } from 'sonner';
import { Loading } from '@/components/ui/loading';

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
  flowId?: string; // Add flowId for API calls
}

export function FlowCanvas({ selectedNodeType, onNodeSelect, selectedNode, flowId }: FlowCanvasProps) {
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
              active_version: apiNode.active_version || null,
              total_versions: apiNode.total_versions || apiNode.versions.length,
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
  const determineNodeType = (nodeName?: string): string => {
    const name = (nodeName ?? '').toLowerCase();
    if (!name) return 'sftp_collector'; // default fallback when name is missing
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
    async (params: Connection) => {
      console.log('🔗 Connecting nodes:', params);
      
      // Create edge with smooth bezier curves like FlowPipeline
      const newEdge = {
        ...params,
        type: 'smoothstep', // Use smoothstep for smoother connections
        animated: true,
        style: {
          stroke: 'hsl(var(--primary))',
          strokeWidth: 3,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: 'hsl(var(--primary))',
          width: 20,
          height: 20,
        },
      };
      
      // Optimistically update UI first
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Make real-time API calls if flowId is provided
      if (flowId && params.source && params.target) {
        try {
          // 1. Create the edge connection
          await flowService.createFlowEdge({
            flow: flowId,
            from_node: params.source,
            to_node: params.target,
            condition: ''
          });
          
          // 2. Update the target node's from_node_id field
          await flowService.updateFlowNodeConnection(params.target, params.source);
          
          console.log('✅ Connection created successfully via API');
          toast.success('Nodes connected successfully');
        } catch (error) {
          console.error('❌ Error creating connection:', error);
          toast.error('Failed to create connection');
          
          // Revert optimistic update on error
          setEdges((eds) => eds.filter(edge => 
            !(edge.source === params.source && edge.target === params.target)
          ));
        }
      }
    },
    [setEdges, flowId],
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

  // Handle edge deletion
  const onEdgesDelete = useCallback(
    async (edgesToDelete: Edge[]) => {
      console.log('🗑️ Deleting edges:', edgesToDelete);
      
      // Optimistically update UI first
      setEdges((eds) => eds.filter(edge => 
        !edgesToDelete.some(delEdge => delEdge.id === edge.id)
      ));
      
      // Make real-time API calls if flowId is provided
      if (flowId) {
        try {
          for (const edge of edgesToDelete) {
            // 1. Delete the edge
            await flowService.deleteFlowEdge(edge.id);
            
            // 2. Clear from_node_id on the target node
            if (edge.target) {
              await flowService.updateFlowNodeConnection(edge.target, null);
            }
          }
          
          console.log('✅ Edges deleted successfully via API');
          toast.success('Connections removed successfully');
        } catch (error) {
          console.error('❌ Error deleting edges:', error);
          toast.error('Failed to remove connections');
          
          // Revert optimistic update on error
          setEdges((eds) => [...eds, ...edgesToDelete]);
        }
      }
    },
    [setEdges, flowId],
  );

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <Loading text="Loading nodes from API..." />
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
        onEdgesDelete={onEdgesDelete}
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
