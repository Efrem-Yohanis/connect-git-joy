import { useState, useCallback, useMemo, useEffect } from 'react';
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
  Position,
  Handle,
  BackgroundVariant,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight, ChevronDown, Save, ArrowLeft, Database } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { NodePalette } from './NodePalette';
import { useFlow, flowService } from '@/services/flowService';
import { nodeService } from '@/services/nodeService';
import { subnodeService } from '@/services/subnodeService';

interface NodeData extends Record<string, unknown> {
  label: string;
  status: 'deployed' | 'draft';
  selectedSubnode: string | null;
  availableSubnodes: Array<{ id: string; name: string }>;
  nodeId: string;
}

interface SimplifiedNodeProps {
  data: NodeData;
  id: string;
}

// Simplified node component
const SimplifiedNode = ({ data, id }: SimplifiedNodeProps) => {
  const [subnodes, setSubnodes] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(false);

  // Fetch subnodes when component mounts
  useEffect(() => {
    const fetchSubnodes = async () => {
      if (!data.nodeId) return;
      
      setLoading(true);
      try {
        const allSubnodes = await subnodeService.getAllSubnodes();
        const nodeSubnodes = allSubnodes.results
          .filter(subnode => subnode.node_family === data.nodeId)
          .map(subnode => ({ id: subnode.id, name: subnode.name }));
        setSubnodes(nodeSubnodes);
      } catch (error) {
        console.error('Error fetching subnodes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubnodes();
  }, [data.nodeId]);

  const getStatusColor = (status: string) => {
    return status === 'deployed' ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground';
  };

  return (
    <div className="bg-card border-2 border-border p-4 min-w-[240px] shadow-md">
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-primary !border-primary !w-3 !h-3" 
      />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm">{data.label}</h3>
          <Badge className={`text-xs ${getStatusColor(data.status)}`}>
            {data.status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-medium">Subnode:</label>
          {loading ? (
            <div className="text-xs text-muted-foreground">Loading...</div>
          ) : (
            <Select
              value={data.selectedSubnode || ""}
              onValueChange={(value) => {
                // This would trigger an update in the parent component
                console.log('Subnode selected:', value);
              }}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="No subnode selected" />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border shadow-lg">
                {subnodes.map((subnode) => (
                  <SelectItem key={subnode.id} value={subnode.id} className="text-xs">
                    {subnode.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-primary !border-primary !w-3 !h-3" 
      />
    </div>
  );
};

export function FlowEditor() {
  const navigate = useNavigate();
  const { id: flowId } = useParams();
  const [isNodePanelExpanded, setIsNodePanelExpanded] = useState(true);
  
  // Fetch flow data if editing existing flow
  const { data: flowData, loading: flowLoading } = useFlow(flowId || '');
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node<NodeData>>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowNodeMap, setFlowNodeMap] = useState<Map<string, string>>(new Map());

  // Update flow data when loaded from API
  useEffect(() => {
    if (flowData && flowId) {
      // For now, start with empty canvas - conversion logic can be added later
      setNodes([]);
      setEdges([]);
    }
  }, [flowData, flowId, setNodes, setEdges]);

  const onConnect = useCallback(
    async (params: Connection) => {
      console.log('🔗 Connecting nodes:', params);
      
      // Add edge with same styling as FlowPipeline - flexible bezier curves
      const newEdge: Edge = {
        id: `e${params.source}-${params.target}`,
        ...params,
        type: 'bezier', // Flexible curved connections like streams page
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
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      if (flowId && params.target && params.source) {
        try {
          const targetFlowNodeId = flowNodeMap.get(params.target);
          const sourceFlowNodeId = flowNodeMap.get(params.source);
          
          if (targetFlowNodeId && sourceFlowNodeId) {
            await flowService.createFlowEdge({
              flow: flowId,
              from_node: sourceFlowNodeId,
              to_node: targetFlowNodeId,
              condition: ''
            });
            
            await flowService.updateFlowNodeConnection(targetFlowNodeId, sourceFlowNodeId);
            
            toast.success('Nodes connected successfully');
          }
        } catch (error) {
          console.error('❌ Error creating connection:', error);
          toast.error('Failed to connect nodes');
          
          // Revert on error
          setEdges((eds) => eds.filter(edge => 
            !(edge.source === params.source && edge.target === params.target)
          ));
        }
      }
    },
    [setEdges, flowId, flowNodeMap],
  );

  const addNodeToCanvas = async (nodeId: string, position?: { x: number; y: number }) => {
    try {
      const nodeData = await nodeService.getNode(nodeId);
      console.log('✅ Node fetched:', nodeData);
      
      const activeVersion = nodeData.published_version || nodeData.versions?.[0];
      const canvasNodeId = `canvas-node-${Date.now()}`;
      
      const newNode: Node<NodeData> = {
        id: canvasNodeId,
        type: 'simplified',
        position: position || { x: Math.random() * 300 + 200, y: Math.random() * 200 + 150 },
        data: {
          label: nodeData.name,
          status: 'draft', // Default to draft since we can't reliably check deployment status
          selectedSubnode: null,
          availableSubnodes: [],
          nodeId: nodeId,
        },
      };

      // Add to flow via API if editing existing flow
      if (flowId) {
        try {
          const flowNode = await flowService.createFlowNode({
            node_family: nodeId,
            flow: flowId
          });
          
          setFlowNodeMap(prev => new Map(prev.set(canvasNodeId, flowNode.id)));
          setNodes((prev) => [...prev, newNode]);
          
          toast.success(`${nodeData.name} added to flow`);
        } catch (apiError) {
          console.error('❌ API call failed:', apiError);
          setNodes((prev) => [...prev, newNode]);
          toast.error('Node added locally only - API sync failed');
        }
      } else {
        setNodes((prev) => [...prev, newNode]);
        toast.success(`${nodeData.name} added to canvas`);
      }
    } catch (error) {
      console.error('❌ Error adding node:', error);
      toast.error('Failed to add node');
    }
  };

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const nodeId = event.dataTransfer.getData('application/reactflow');
      if (!nodeId) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left - 100,
        y: event.clientY - reactFlowBounds.top - 50,
      };

      addNodeToCanvas(nodeId, position);
    },
    [addNodeToCanvas],
  );

  const saveFlow = async () => {
    try {
      if (flowId) {
        const validation = await flowService.validateFlow(flowId);
        
        if (!validation.valid) {
          toast.error(validation.errors?.join(', ') || 'Flow has validation errors');
          return;
        }

        await flowService.updateFlow(flowId, {
          name: flowData?.name || 'Untitled Flow',
          description: flowData?.description || '',
        });
        
        toast.success('Flow saved successfully');
        navigate('/flows');
      } else {
        toast.error('Cannot save: No flow ID');
      }
    } catch (error) {
      console.error('Error saving flow:', error);
      toast.error('Failed to save flow');
    }
  };

  // Default edge options for flexible bezier curves
  const defaultEdgeOptions = {
    type: 'bezier',
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

  const nodeTypes = useMemo(() => ({
    simplified: SimplifiedNode,
  }), []);

  if (flowLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/flows')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Flows
          </Button>
          <h1 className="text-xl font-semibold">
            {flowData?.name || 'Flow Editor'}
          </h1>
        </div>
        
        <Button onClick={saveFlow} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Collapsible Node Panel */}
        <div className={`bg-card border-r border-border transition-all duration-300 ${
          isNodePanelExpanded ? 'w-80' : 'w-12'
        }`}>
          <Collapsible open={isNodePanelExpanded} onOpenChange={setIsNodePanelExpanded}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full h-12 flex items-center justify-start px-3 border-b border-border"
              >
                {isNodePanelExpanded ? (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    <Database className="h-4 w-4 mr-2" />
                    <span>Nodes</span>
                  </>
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="h-[calc(100vh-8rem)] overflow-y-auto">
              {isNodePanelExpanded && (
                <div className="p-4">
                  <NodePalette onAddNode={addNodeToCanvas} />
                </div>
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
        
        {/* Canvas */}
        <div className="flex-1 bg-background">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            className="bg-background"
          >
            <Controls className="bg-card border-border" />
            <MiniMap 
              className="bg-card border-border" 
              nodeColor="hsl(var(--primary))"
              maskColor="hsl(var(--background) / 0.8)"
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
  );
}