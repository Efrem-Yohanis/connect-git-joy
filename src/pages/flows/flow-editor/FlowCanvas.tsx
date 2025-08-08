import React, { useCallback, useState, useEffect } from 'react';
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
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { SftpCollectorNode } from './nodes/SftpCollectorNode';
import { FdcNode } from './nodes/FdcNode';
import { Asn1DecoderNode } from './nodes/Asn1DecoderNode';
import { AsciiDecoderNode } from './nodes/AsciiDecoderNode';
import { ValidationBlnNode } from './nodes/ValidationBlnNode';
import { EnrichmentBlnNode } from './nodes/EnrichmentBlnNode';
import { EncoderNode } from './nodes/EncoderNode';
import { DiameterInterfaceNode } from './nodes/DiameterInterfaceNode';
import { RawBackupNode } from './nodes/RawBackupNode';
import { useNodes } from '../../../services/nodeService';
import type { Node as ApiNode } from '../../../services/nodeService';
import { flowService, useDeployedNodes } from '../../../services/flowService';
import { useToast } from '../../../hooks/use-toast';
import { useParams } from 'react-router-dom';

// Use the updated SFTP Collector Node for all types for now since it has the best implementation
const nodeTypes = {
  sftp_collector: SftpCollectorNode,
  fdc: SftpCollectorNode,
  asn1_decoder: SftpCollectorNode,
  ascii_decoder: SftpCollectorNode,
  validation_bln: SftpCollectorNode,
  enrichment_bln: SftpCollectorNode,
  encoder: SftpCollectorNode,
  diameter_interface: SftpCollectorNode,
  raw_backup: SftpCollectorNode,
};

// Transform API node data to React Flow format
const transformApiNodesToFlowNodes = (apiNodes: ApiNode[]): Node[] => {
  // Map to determine node type based on name or other properties
  const getNodeType = (nodeName: string): string => {
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
    return 'sftp_collector'; // Default fallback
  };

  return apiNodes.map((apiNode, index) => ({
    id: apiNode.id,
    type: getNodeType(apiNode.name),
    position: { x: 100 + (index % 3) * 300, y: 100 + Math.floor(index / 3) * 250 },
    data: {
      label: apiNode.name,
      subnodes: apiNode.subnodes || [],
      version: apiNode.version,
      last_updated_at: apiNode.last_updated_at,
      description: `Node version ${apiNode.version}`,
      nodeType: getNodeType(apiNode.name),
      deployed: apiNode.subnodes.some(sub => sub.is_selected), // Consider deployed if any subnode is selected
      parameters: apiNode.subnodes.flatMap(sub => sub.parameters || []),
    },
  }));
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'sftp_collector',
    position: { x: 100, y: 100 },
    data: { 
      label: 'SFTP Source',
      description: 'Collect data from SFTP server',
      parameters: {
        host: 'sftp.example.com',
        port: 22,
        username: 'user'
      },
      subnodes: [
        { id: 'sub1', name: 'Connection Handler', script_name: 'sftp_connect.py', status: 'active' },
        { id: 'sub2', name: 'File Scanner', script_name: 'file_scan.py', status: 'deployed' },
        { id: 'sub3', name: 'Data Collector', script_name: 'collect_data.py', status: 'active' }
      ]
    },
  },
  {
    id: '2',
    type: 'asn1_decoder',
    position: { x: 400, y: 100 },
    data: { 
      label: 'ASN.1 Decoder',
      description: 'Decode ASN.1 formatted data',
      parameters: {
        schema: 'cdr_schema.asn',
        validation: true
      },
      subnodes: [
        { id: 'sub4', name: 'Schema Loader', script_name: 'load_schema.py', status: 'deployed' },
        { id: 'sub5', name: 'Data Parser', script_name: 'parse_asn1.py', status: 'active' }
      ]
    },
  },
  {
    id: '3',
    type: 'validation_bln',
    position: { x: 700, y: 100 },
    data: { 
      label: 'Data Validation',
      description: 'Validate data quality and format',
      parameters: {
        rules: 'validation_rules.json',
        strict_mode: true
      },
      subnodes: [
        { id: 'sub6', name: 'Rule Engine', script_name: 'validate_rules.py', status: 'active' },
        { id: 'sub7', name: 'Quality Check', script_name: 'quality_check.py', status: 'deployed' },
        { id: 'sub8', name: 'Error Handler', script_name: 'handle_errors.py', status: 'inactive' }
      ]
    },
  },
  {
    id: '4',
    type: 'enrichment_bln',
    position: { x: 1000, y: 50 },
    data: { 
      label: 'Data Enrichment',
      description: 'Enrich data with additional fields',
      parameters: {
        lookup_table: 'enrichment_data',
        cache_enabled: true
      },
      subnodes: [
        { id: 'sub9', name: 'Lookup Service', script_name: 'lookup_data.py', status: 'deployed' },
        { id: 'sub10', name: 'Cache Manager', script_name: 'cache_mgr.py', status: 'active' }
      ]
    },
  },
  {
    id: '5',
    type: 'raw_backup',
    position: { x: 1000, y: 200 },
    data: { 
      label: 'Raw Backup',
      description: 'Store raw data for backup',
      parameters: {
        storage_path: '/backup/raw_data',
        compression: 'gzip'
      },
      subnodes: [
        { id: 'sub11', name: 'Backup Writer', script_name: 'write_backup.py', status: 'active' },
        { id: 'sub12', name: 'Compression Engine', script_name: 'compress_data.py', status: 'deployed' }
      ]
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    animated: true,
  },
  {
    id: 'e2-3',
    source: '2',
    target: '3',
    animated: true,
  },
  {
    id: 'e3-4',
    source: '3',
    target: '4',
    label: 'Valid',
    sourceHandle: 'valid',
    style: { stroke: 'hsl(var(--success))' },
  },
  {
    id: 'e3-5',
    source: '3',
    target: '5',
    label: 'Invalid',
    sourceHandle: 'invalid',
    style: { stroke: 'hsl(var(--destructive))' },
  },
];

interface FlowCanvasProps {
  onNodeSelect: (node: Node | null) => void;
  onNodeAdd?: (nodeId: string) => void;
}

export function FlowCanvas({ onNodeSelect, onNodeAdd }: FlowCanvasProps) {
  const { data: deployedNodes, loading, error } = useDeployedNodes();
  const { toast } = useToast();
  const { id: flowId } = useParams();
  const reactFlowInstance = useReactFlow();
  
  // Start with empty nodes, will be populated from API
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes when API data is loaded
  useEffect(() => {
    console.log('Deployed nodes loaded:', { deployedNodes, loading, error });
    
    if (deployedNodes && deployedNodes.length > 0) {
      console.log('Using deployed nodes:', deployedNodes);
      // For now, start with mock nodes for demonstration
      setNodes(initialNodes);
    } else if (!loading && error) {
      console.log('API error, using mock nodes:', error);
      // Use mock nodes if API fails
      setNodes(initialNodes);
    } else if (!loading && deployedNodes?.length === 0) {
      console.log('API returned empty, using mock nodes for demo');
      // Use mock nodes if API returns empty for demo purposes
      setNodes(initialNodes);
    }
  }, [deployedNodes, loading, error, setNodes]);

  const onConnect = useCallback(
    async (params: Edge | Connection) => {
      // Add edge to local state
      setEdges((eds) => addEdge(params, eds));
      
      // Update backend connection if we have flow ID
      if (flowId && params.target) {
        try {
          // Find the target node data
          const targetNode = nodes.find(n => n.id === params.target);
          if (targetNode) {
            // Here you would make API call to update the from_node field
            // For now, we'll just log it
            console.log('Updating connection in backend:', {
              flowId,
              targetNodeId: params.target,
              sourceNodeId: params.source,
            });
            
            toast({
              title: "Connection Created",
              description: "Nodes have been connected successfully.",
            });
          }
        } catch (error) {
          console.error('Error updating connection:', error);
          toast({
            title: "Connection Error",
            description: "Failed to update connection in backend.",
            variant: "destructive"
          });
        }
      }
    },
    [setEdges, flowId, nodes, toast],
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();

      const nodeId = event.dataTransfer.getData('application/reactflow');
      if (!nodeId || !flowId) return;

      // Find the deployed node data
      const deployedNode = deployedNodes?.find(n => n.id === nodeId);
      if (!deployedNode) return;

      // Get the drop position
      const reactFlowBounds = reactFlowInstance.getViewport();
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      try {
        // Calculate order (number of existing nodes + 1)
        const order = nodes.length + 1;
        
        // Make API call to add node to flow
        await flowService.addNodeToFlow({
          flow: flowId,
          node: nodeId,
          order: order,
        });

        // Create visual node for canvas
        const newNode: Node = {
          id: `flow-node-${Date.now()}`,
          type: getNodeType(deployedNode.name),
          position: position,
          data: {
            label: deployedNode.name,
            apiNodeId: nodeId, // Store reference to API node
            subnodes: deployedNode.subnodes || [],
            description: `Node with ${deployedNode.subnodes.length} subnodes`,
            nodeType: getNodeType(deployedNode.name),
            deployed: deployedNode.subnodes.some(sub => sub.is_selected),
            parameters: deployedNode.subnodes.flatMap(sub => sub.parameters || []),
          },
        };

        setNodes((nds) => nds.concat(newNode));
        
        toast({
          title: "Node Added",
          description: `${deployedNode.name} has been added to the flow.`,
        });

        // Notify parent component if callback provided
        if (onNodeAdd) {
          onNodeAdd(nodeId);
        }
      } catch (error) {
        console.error('Error adding node to flow:', error);
        toast({
          title: "Error",
          description: "Failed to add node to flow.",
          variant: "destructive"
        });
      }
    },
    [reactFlowInstance, deployedNodes, flowId, nodes.length, setNodes, toast, onNodeAdd],
  );

  // Helper function to determine node type
  const getNodeType = (nodeName: string): string => {
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
    return 'sftp_collector'; // Default fallback
  };

  return (
    <div className="flex-1 bg-canvas-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
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
          showInteractive={true}
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