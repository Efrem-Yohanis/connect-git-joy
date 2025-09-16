import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Square, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

import { CollapsibleNodePalette } from './CollapsibleNodePalette';
import { EnhancedFlowNode } from './EnhancedFlowNode';
import { flowService, useFlow } from '@/services/flowService';
import { nodeService } from '@/services/nodeService';

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
  sftp_collector: EnhancedFlowNode,
  fdc: EnhancedFlowNode,
  asn1_decoder: EnhancedFlowNode,
  ascii_decoder: EnhancedFlowNode,
  validation_bln: EnhancedFlowNode,
  enrichment_bln: EnhancedFlowNode,
  encoder: EnhancedFlowNode,
  diameter_interface: EnhancedFlowNode,
  raw_backup: EnhancedFlowNode,
  enhanced: EnhancedFlowNode,
};

interface RealTimeFlowEditorProps {
  flowId: string;
}

export function RealTimeFlowEditor({ flowId }: RealTimeFlowEditorProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  
  // Flow data from API
  const { data: flowData, loading: flowLoading, refetch: refetchFlow } = useFlow(flowId);
  
  // Canvas state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  
  // Real-time state
  const [flowNodeMap, setFlowNodeMap] = useState<Map<string, string>>(new Map()); // Canvas node ID -> FlowNode ID
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Array<{flow_node_id: string; error: string}>>([]);

  // Load flow graph on mount
  useEffect(() => {
    const loadFlowGraph = async () => {
      if (!flowId) return;
      
      try {
        const graphData = await flowService.getFlowGraph(flowId);
        console.log('📊 Loaded flow graph:', graphData);
        
        // Convert API nodes to React Flow nodes
        const canvasNodes: Node[] = [];
        const nodeIdMapping = new Map<string, string>();
        
        for (let i = 0; i < graphData.nodes.length; i++) {
          const apiNode = graphData.nodes[i];
          const canvasNodeId = `canvas-${apiNode.id}`;
          
          // Get node family data for display
          try {
            const nodeFamily = await nodeService.getNode(apiNode.node_family);
            const nodeType = determineNodeType(nodeFamily.name);
            
            const canvasNode: Node = {
              id: canvasNodeId,
              type: 'enhanced',
              position: { x: 100 + i * 250, y: 100 + (i % 3) * 150 },
              data: {
                label: nodeFamily.name,
                description: nodeFamily.description || '',
                nodeId: apiNode.node_family,
                flowNodeId: apiNode.id,
                selectedSubnode: apiNode.selected_subnode,
                subnodes: nodeFamily.versions?.[0]?.subnodes || [],
                onSubnodeChange: handleSubnodeChange,
              },
            };
            
            canvasNodes.push(canvasNode);
            nodeIdMapping.set(canvasNodeId, apiNode.id);
          } catch (error) {
            console.error('Error loading node family:', apiNode.node_family, error);
          }
        }
        
        // Convert API edges to React Flow edges with same styling as FlowPipeline
        const canvasEdges: Edge[] = graphData.edges.map(apiEdge => ({
          id: apiEdge.id,
          source: `canvas-${apiEdge.from_node}`,
          target: `canvas-${apiEdge.to_node}`,
          type: 'bezier', // Use bezier curves for flexible connections
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
        }));
        
        setNodes(canvasNodes);
        setEdges(canvasEdges);
        setFlowNodeMap(nodeIdMapping);
        
      } catch (error) {
        console.error('❌ Error loading flow graph:', error);
        toast({
          title: "Load Error",
          description: "Failed to load flow graph.",
          variant: "destructive"
        });
      }
    };

    loadFlowGraph();
  }, [flowId, setNodes, setEdges, toast]);

  // Helper function to determine node type
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
    return 'sftp_collector';
  };

  // 🎯 REAL-TIME FUNCTIONALITY 1: Drop Node → Create FlowNode
  const onDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      
      const nodeId = event.dataTransfer.getData('application/reactflow');
      if (!nodeId || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      console.log('🎯 Dropping node:', nodeId, 'at position:', position);

      try {
        // 🚀 Real-time API call: Create FlowNode immediately
        const flowNode = await flowService.createFlowNode({
          flow: flowId,
          node_family: nodeId
        });
        console.log('✅ FlowNode created:', flowNode);

        // Get node family data for display
        const nodeFamily = await nodeService.getNode(nodeId);
        const nodeType = determineNodeType(nodeFamily.name);
        
        // Create canvas node
        const canvasNodeId = `canvas-${flowNode.id}`;
        const newNode: Node = {
          id: canvasNodeId,
          type: 'enhanced',
          position,
          data: {
            label: nodeFamily.name,
            description: nodeFamily.description || '',
            nodeId: nodeId,
            flowNodeId: flowNode.id,
            selectedSubnode: flowNode.selected_subnode,
            subnodes: nodeFamily.versions?.[0]?.subnodes || [],
            onSubnodeChange: handleSubnodeChange,
          },
        };

        // Update state immediately
        setNodes((nds) => [...nds, newNode]);
        setFlowNodeMap(prev => new Map(prev.set(canvasNodeId, flowNode.id)));

        toast({
          title: "Node Added",
          description: `${nodeFamily.name} has been added to the flow.`,
        });

      } catch (error) {
        console.error('❌ Error creating FlowNode:', error);
        toast({
          title: "Error",
          description: "Failed to add node to flow.",
          variant: "destructive"
        });
      }
    },
    [flowId, setNodes, toast],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // 🎯 REAL-TIME FUNCTIONALITY 2: Connect Nodes → Create Edge
  const onConnect = useCallback(
    async (params: Connection) => {
      console.log('🔗 Connecting nodes:', params);
      
      if (!params.source || !params.target) return;

      // Optimistically update UI first with smoothstep style
      const newEdge = {
        id: `temp-${Date.now()}`,
        source: params.source,
        target: params.target,
        type: 'smoothstep',
        animated: true,
      };
      setEdges((eds) => [...eds, newEdge]);
      
      try {
        // Get FlowNode IDs from mapping
        const sourceFlowNodeId = flowNodeMap.get(params.source);
        const targetFlowNodeId = flowNodeMap.get(params.target);
        
        if (!sourceFlowNodeId || !targetFlowNodeId) {
          throw new Error('FlowNode IDs not found');
        }

        // 🚀 Real-time API call: Create Edge immediately
        const edge = await flowService.createFlowEdge({
          flow: flowId,
          from_node: sourceFlowNodeId,
          to_node: targetFlowNodeId,
          condition: ''
        });
        console.log('✅ Edge created:', edge);

        // Update edge with real ID and maintain style
        setEdges((eds) => eds.map(e => 
          e.id === newEdge.id ? { 
            ...e, 
            id: edge.id,
            type: 'smoothstep',
            animated: true,
          } : e
        ));

        toast({
          title: "Connection Created",
          description: "Nodes have been connected successfully.",
        });

      } catch (error) {
        console.error('❌ Error creating edge:', error);
        
        // Remove optimistic edge on error
        setEdges((eds) => eds.filter(e => e.id !== newEdge.id));
        
        toast({
          title: "Connection Error",
          description: "Failed to create connection.",
          variant: "destructive"
        });
      }
    },
    [flowId, flowNodeMap, setEdges, toast],
  );

  // 🎯 REAL-TIME FUNCTIONALITY 3: Select SubNode
  const handleSubnodeChange = useCallback(async (nodeId: string, subnodeId: string) => {
    console.log('🔄 Changing subnode for node:', nodeId, 'to:', subnodeId);
    
    const flowNodeId = flowNodeMap.get(nodeId);
    if (!flowNodeId) {
      console.error('FlowNode ID not found for canvas node:', nodeId);
      return;
    }

    // Optimistically update UI
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, selectedSubnode: subnodeId } }
          : node
      )
    );

    try {
      // 🚀 Real-time API call: Set subnode immediately
      const updatedFlowNode = await flowService.setFlowNodeSubnode(flowNodeId, subnodeId);
      console.log('✅ Subnode updated:', updatedFlowNode);

      // Update node data with parameters
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { 
                ...node, 
                data: { 
                  ...node.data, 
                  selectedSubnode: subnodeId,
                  parameters: updatedFlowNode.parameters 
                } 
              }
            : node
        )
      );

      toast({
        title: "Subnode Selected",
        description: "Subnode selection updated with parameters.",
      });

    } catch (error) {
      console.error('❌ Error setting subnode:', error);
      
      // Revert optimistic update
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, selectedSubnode: node.data.selectedSubnode } }
            : node
        )
      );
      
      toast({
        title: "Update Error",
        description: "Failed to update subnode selection.",
        variant: "destructive"
      });
    }
  }, [flowNodeMap, setNodes, toast]);

  // 🎯 REAL-TIME FUNCTIONALITY 4: Validate Flow
  const handleValidateFlow = useCallback(async () => {
    setIsValidating(true);
    setValidationErrors([]);

    try {
      // 🚀 Real-time API call: Validate flow immediately
      const validation = await flowService.validateFlow(flowId);
      console.log('✅ Flow validation result:', validation);

      if (validation.valid) {
        toast({
          title: "Flow Valid",
          description: "Flow validation passed successfully.",
        });
      } else {
        setValidationErrors(validation.errors || []);
        toast({
          title: "Flow Invalid",
          description: `Found ${validation.errors?.length || 0} validation errors.`,
          variant: "destructive"
        });
      }

    } catch (error) {
      console.error('❌ Error validating flow:', error);
      toast({
        title: "Validation Error",
        description: "Failed to validate flow.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  }, [flowId, toast]);

  const onNodeClick = useCallback(
    (event: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  if (flowLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="border-b bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate('/flows')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Flows
            </Button>
            <div>
              <h1 className="text-xl font-semibold">
                {flowData?.name || `Flow ${flowId}`}
              </h1>
              <p className="text-sm text-muted-foreground">
                Real-time flow editor
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {validationErrors.length > 0 && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="h-3 w-3" />
                {validationErrors.length} errors
              </Badge>
            )}
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleValidateFlow}
              disabled={isValidating}
            >
              {isValidating ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              Validate Flow
            </Button>
            
            <Button size="sm" className="gap-2" onClick={handleValidateFlow}>
              <CheckCircle className="h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Collapsible Node Palette */}
        <CollapsibleNodePalette onAddNode={() => {}} />
        
        {/* Flow Canvas */}
        <div className="flex-1">
          <div 
            ref={reactFlowWrapper}
            className="w-full h-full"
            onDrop={onDrop}
            onDragOver={onDragOver}
          >
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
              fitViewOptions={{ padding: 0.2 }}
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
        </div>
      </div>
    </div>
  );
}