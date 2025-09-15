import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Network, 
  List, 
  Play, 
  Square, 
  RotateCcw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import {
  ReactFlow,
  Controls,
  Background,
  Node,
  Edge,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { memo } from "react";

interface StreamNode extends Record<string, unknown> {
  id: string;
  name: string;
  type: "collector" | "processor" | "distributor";
  status: "running" | "partial" | "stopped";
  lastRun: string;
  processed: number;
  errors: number;
  warnings: number;
  host: string;
  nextRun?: string;
}

// Custom node component for the pipeline
const PipelineNode = memo(({ data }: { data: StreamNode }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "border-success bg-success/10";
      case "stopped": return "border-muted-foreground bg-muted/30";
      case "partial": return "border-warning bg-warning/10";
      default: return "border-muted-foreground bg-muted/30";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="h-4 w-4 text-success" />;
      case "stopped": return <XCircle className="h-4 w-4 text-muted-foreground" />;
      case "partial": return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <XCircle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "collector": return "bg-blue-50 text-blue-700 border-blue-200";
      case "processor": return "bg-purple-50 text-purple-700 border-purple-200";
      case "distributor": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className={`bg-card border-2 p-4 min-w-[220px] shadow-md transition-all duration-200 ${getStatusColor(data.status)}`}>
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-primary !border-primary !w-3 !h-3" 
      />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={getTypeColor(data.type)} variant="outline">
            {data.type}
          </Badge>
          {getStatusIcon(data.status)}
        </div>
        
        <div>
          <h3 className="font-semibold text-sm mb-1">{data.name}</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>Host: {data.host}</div>
            <div>Last run: {data.lastRun}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-background/50 p-2 rounded border">
            <div className="font-medium">Processed</div>
            <div className="text-foreground">{data.processed.toLocaleString()}</div>
          </div>
          <div className="bg-background/50 p-2 rounded border">
            <div className="font-medium">Errors</div>
            <div className={data.errors > 0 ? "text-destructive" : "text-success"}>
              {data.errors}
            </div>
          </div>
        </div>
        
        {data.warnings > 0 && (
          <div className="text-xs text-warning">
            ⚠️ {data.warnings} warnings
          </div>
        )}
        
        <div className="text-xs text-muted-foreground">
          Next: {data.nextRun === "Cannot schedule" ? (
            <span className="text-destructive">{data.nextRun}</span>
          ) : data.nextRun === "N/A" ? (
            <span>Continuous</span>
          ) : (
            data.nextRun
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
});

PipelineNode.displayName = 'PipelineNode';

const mockNodes: StreamNode[] = [
  {
    id: "1",
    name: "SFTP Collector",
    type: "collector",
    status: "running",
    lastRun: "2024-01-15 14:35:00",
    processed: 15420,
    errors: 2,
    warnings: 5,
    host: "collector-01.domain.com",
    nextRun: "2024-01-15 15:00:00"
  },
  {
    id: "2", 
    name: "ASCII Decoder",
    type: "processor",
    status: "running",
    lastRun: "2024-01-15 14:34:30",
    processed: 15420,
    errors: 0,
    warnings: 1,
    host: "processor-01.domain.com",
    nextRun: "N/A"
  },
  {
    id: "3",
    name: "Validation BLN",
    type: "processor", 
    status: "partial",
    lastRun: "2024-01-15 14:30:00",
    processed: 12340,
    errors: 8,
    warnings: 12,
    host: "processor-02.domain.com",
    nextRun: "Cannot schedule"
  },
  {
    id: "4",
    name: "FDC Distributor",
    type: "distributor",
    status: "running",
    lastRun: "2024-01-15 14:34:45",
    processed: 12340,
    errors: 0,
    warnings: 0,
    host: "distributor-01.domain.com",
    nextRun: "N/A"
  }
];

// Convert stream nodes to ReactFlow nodes and edges
const createFlowData = (streamNodes: StreamNode[]) => {
  const nodes: Node[] = streamNodes.map((node, index) => ({
    id: node.id,
    type: 'pipelineNode',
    position: { x: index * 300, y: 100 },
    data: node,
  }));

  const edges: Edge[] = [];
  for (let i = 0; i < streamNodes.length - 1; i++) {
    edges.push({
      id: `${streamNodes[i].id}-${streamNodes[i + 1].id}`,
      source: streamNodes[i].id,
      target: streamNodes[i + 1].id,
      type: 'smoothstep',
    });
  }

  return { nodes, edges };
};

const nodeTypes = {
  pipelineNode: PipelineNode,
};

interface FlowNodesViewProps {
  nodes?: StreamNode[];
}

export function FlowNodesView({ nodes = mockNodes }: FlowNodesViewProps) {
  const { nodes: flowNodes, edges: flowEdges } = createFlowData(nodes);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-success/10 text-success border-success/20";
      case "stopped": return "bg-muted text-muted-foreground border-border";
      case "partial": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <CheckCircle className="h-4 w-4" />;
      case "stopped": return <XCircle className="h-4 w-4" />;
      case "partial": return <AlertTriangle className="h-4 w-4" />;
      default: return <XCircle className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "collector": return "bg-blue-50 text-blue-700 border-blue-200";
      case "processor": return "bg-purple-50 text-purple-700 border-purple-200";
      case "distributor": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Flow Pipeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="graph" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="graph" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Graph View
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="graph" className="mt-6">
            {/* Graph View - ReactFlow Pipeline */}
            <div className="h-[500px] w-full bg-background border rounded-lg">
              <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{
                  padding: 0.2,
                }}
                className="bg-background"
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
              >
                <Controls className="bg-card border-border" />
                <Background 
                  variant={BackgroundVariant.Dots} 
                  gap={20} 
                  size={1} 
                  className="opacity-30" 
                />
              </ReactFlow>
            </div>
          </TabsContent>
          
          <TabsContent value="list" className="mt-6">
            {/* List View - Table */}
            <div className="rounded-md border">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-muted/50">
                    <tr>
                      <th className="text-left p-4 font-medium">Node Name</th>
                      <th className="text-left p-4 font-medium">Type</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      <th className="text-left p-4 font-medium">Scheduling</th>
                      <th className="text-left p-4 font-medium">Counters</th>
                      <th className="text-left p-4 font-medium">Host</th>
                      <th className="text-left p-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {nodes.map((node) => (
                      <tr key={node.id} className="border-b hover:bg-muted/30">
                        <td className="p-4 font-medium">{node.name}</td>
                        <td className="p-4">
                          <Badge className={getTypeColor(node.type)} variant="outline">
                            {node.type}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusColor(node.status)}>
                            {getStatusIcon(node.status)}
                            <span className="ml-1 capitalize">{node.status}</span>
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {node.nextRun === "Cannot schedule" ? (
                              <span className="text-destructive">{node.nextRun}</span>
                            ) : node.nextRun === "N/A" ? (
                              <span className="text-muted-foreground">{node.nextRun}</span>
                            ) : (
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {node.nextRun}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-sm space-y-1">
                            <div>Processed: {node.processed.toLocaleString()}</div>
                            {node.errors > 0 && (
                              <div className="text-destructive">Errors: {node.errors}</div>
                            )}
                            {node.warnings > 0 && (
                              <div className="text-warning">Warnings: {node.warnings}</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {node.host}
                          </code>
                        </td>
                        <td className="p-4">
                          <div className="flex gap-1">
                            {node.status === "stopped" && (
                              <Button size="sm" variant="outline">
                                <Play className="h-3 w-3" />
                              </Button>
                            )}
                            {(node.status === "running" || node.status === "partial") && (
                              <Button size="sm" variant="outline">
                                <Square className="h-3 w-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <RotateCcw className="h-3 w-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}