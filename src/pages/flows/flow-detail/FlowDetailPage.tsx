import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingCard } from "@/components/ui/loading";
import { FlowCanvas } from "./FlowCanvas";
import { 
  ArrowLeft,
  Play, 
  Pause, 
  RotateCcw, 
  Clock,
  Server,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  TrendingUp,
  Filter,
  Search,
  Eye,
  List,
  Network,
  Zap,
  Settings,
  Bell,
  FileText,
  Download,
  Edit,
  Plus,
  Square,
  History,
  MoreVertical,
  Copy,
  Trash2
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { PerformanceStats } from "@/pages/mediations/components/PerformanceStats";
import { AlertsLogsPanel } from "@/pages/mediations/components/AlertsLogsPanel";
import { useToast } from "@/hooks/use-toast";
import { flowService, FlowVersion } from "@/services/flowService";

export function FlowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  useEffect(() => {
    const fetchFlowStructure = async () => {
      try {
        const response = await flowService.getFlowGraph(id!);
        setFlow(response);
        setDescription((response as any)?.description || "No description available");
      } catch (err) {
        setError("Error fetching flow structure");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFlowStructure();
    }
  }, [id]);

  if (loading) {
    return <LoadingCard text="Loading flow details..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!flow) {
    return <div>No flow found.</div>;
  }

  // Helper function to determine node type based on name or other criteria
  const getNodeType = (nodeName?: string): string => {
    const name = (nodeName ?? '').toLowerCase();
    if (!name) return 'generic';
    if (name.includes('sftp') || name.includes('collector')) return 'sftp_collector';
    if (name.includes('fdc')) return 'fdc';
    if (name.includes('asn1') || name.includes('decoder')) return 'asn1_decoder';
    if (name.includes('ascii')) return 'ascii_decoder';
    if (name.includes('validation')) return 'validation_bln';
    if (name.includes('enrichment')) return 'enrichment_bln';
    if (name.includes('encoder')) return 'encoder';
    if (name.includes('diameter')) return 'diameter_interface';
    if (name.includes('backup')) return 'raw_backup';
    return 'generic';
  };

  // Create unique nodes map to avoid duplicates
  const uniqueNodes = new Map();
  flow.nodes?.forEach((node) => {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  });

  // Prepare nodes from the unique nodes with proper positioning  
  const nodes = Array.from(uniqueNodes.values()).map((node, index) => {
    const nodeType = getNodeType(node.name);
    
    return {
      id: node.id,
      type: nodeType,
      position: { 
        x: (index % 4) * 300 + 100,
        y: Math.floor(index / 4) * 200 + 100 
      },
      data: {
        label: node.name,
        description: `Order: ${node.order}`,
        node: node,
        selected_subnode: node.selected_subnode_id ? { id: node.selected_subnode_id } : undefined,
        parameters: [],
        subnodes: [],
      },
    };
  });

  // Prepare edges from flow edges
  const edges = flow.edges?.map((edge) => ({
    id: edge.id,
    source: edge.from_node,
    target: edge.to_node,
    animated: true,
    label: edge.condition || undefined,
  })) || [];

  // Convert nodes for table list view
  const nodesData = Array.from(uniqueNodes.values()).map((node) => ({
    id: node.id,
    name: node.name,
    type: node.type || "Generic",
    status: flow.is_running ? "RUNNING" : "STOPPED",
    scheduling: "Real-time",
    processed: Math.floor(Math.random() * 50000),
    errors: Math.floor(Math.random() * 100),
    host: "flow-host-01",
    position: { x: 100, y: 100 },
    subnodeName: node.selected_subnode?.name || "Default_Subnode"
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING": return "bg-success text-success-foreground";
      case "STOPPED": return "bg-destructive text-destructive-foreground";
      case "PARTIAL": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const handleRunFlow = async () => {
    try {
      await flowService.runFlow(id!);
      setFlow(prev => ({ ...prev, is_running: true }));
      toast({
        title: "Flow Started",
        description: "The flow has been started successfully.",
      });
    } catch (err: any) {
      console.error("Error starting flow:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error starting flow";
      toast({
        title: "Error Starting Flow",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleStopFlow = async () => {
    try {
      await flowService.stopFlow(id!);
      setFlow(prev => ({ ...prev, is_running: false }));
      toast({
        title: "Flow Stopped",
        description: "The flow has been stopped successfully.",
      });
    } catch (err: any) {
      console.error("Error stopping flow:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error stopping flow";
      toast({
        title: "Error Stopping Flow",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const flowStatus = flow.is_running ? "RUNNING" : "STOPPED";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard")}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                back
              </Button>
              
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-foreground">
                  {flow.name}
                </h1>
                <Badge variant="outline" className="text-xs">
                  v{flow.version}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Edit/Create New Version Button */}
              {flow.is_deployed ? (
                <Button 
                  variant="outline"
                  size="icon"
                  title="Create New Version"
                  onClick={() => toast({ title: "Create New Version", description: "Creating new version..." })}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  variant="outline"
                  size="icon"
                  title="Edit Version"
                  onClick={() => navigate(`/flows/${id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
              
              {/* Deploy/Undeploy Button */}
              <Button 
                variant={flow.is_deployed ? "destructive" : "default"}
                size="icon"
                title={flow.is_deployed ? "Undeploy" : "Deploy"}
                onClick={() => {
                  setFlow(prev => ({ ...prev, is_deployed: !prev.is_deployed }));
                  toast({
                    title: flow.is_deployed ? "Flow Undeployed" : "Flow Deployed",
                    description: flow.is_deployed ? "Flow has been undeployed" : "Flow has been deployed successfully"
                  });
                }}
              >
                {flow.is_deployed ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              {/* Version History Button */}
              <Button 
                variant="outline" 
                size="icon"
                title="Version History"
                onClick={() => toast({ title: "Version History", description: "Opening version history..." })}
              >
                <History className="h-4 w-4" />
              </Button>

              {/* Three Dots Menu with Flow Controls */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    title="More Actions"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {!flow.is_running && (
                    <DropdownMenuItem onClick={handleRunFlow}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Flow
                    </DropdownMenuItem>
                  )}
                  {flow.is_running && (
                    <DropdownMenuItem onClick={handleStopFlow}>
                      <Pause className="h-4 w-4 mr-2" />
                      Stop Flow
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => {
                    if (flow.is_running) {
                      handleStopFlow();
                      setTimeout(() => handleRunFlow(), 1000);
                    } else {
                      handleRunFlow();
                    }
                  }}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Restart Flow
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Export Version", description: "Exporting version..." })}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Version
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast({ title: "Clone Version", description: "Cloning version..." })}>
                    <Copy className="h-4 w-4 mr-2" />
                    Clone Version
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => toast({ title: "Delete Version", description: "Deleting version..." })}
                    disabled={flow.is_deployed}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Version
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* General Info Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                <Badge className={getStatusColor(flowStatus)}>
                  {flowStatus}
                </Badge>
              </div>

              {/* Deployment Status */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Deployment</Label>
                <Badge className={flow.is_deployed ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"}>
                  {flow.is_deployed ? "DEPLOYED" : "NOT DEPLOYED"}
                </Badge>
              </div>

              {/* Version */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  Version
                </Label>
                <div className="text-sm font-medium text-foreground">v{flow.version}</div>
              </div>

              {/* Node Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Network className="h-4 w-4" />
                  Nodes
                </Label>
                <div className="text-sm font-medium text-foreground">{flow.nodes?.length || 0} nodes</div>
              </div>

              {/* Created By */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
                <div className="text-sm font-medium text-foreground">{flow.created_by || 'Unknown'}</div>
              </div>

              {/* Updated */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Last Updated
                </Label>
                <div className="text-sm font-medium text-foreground">
                  {flow.updated_at ? new Date(flow.updated_at).toLocaleString() : 'Unknown'}
                </div>
              </div>
            </div>

            {/* Description (Editable) */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px]"
                    placeholder="Enter flow description..."
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        setFlow(prev => ({ ...prev, description }));
                        setIsEditingDescription(false);
                        toast({
                          title: "Description Updated",
                          description: "Flow description has been updated.",
                        });
                      }}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDescription((flow as any)?.description || "No description available");
                        setIsEditingDescription(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div 
                  className="text-sm text-foreground p-3 bg-muted/50 cursor-pointer hover:bg-muted border border-dashed border-muted-foreground/30"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description || "Click to add description..."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Flow Pipeline - Graph and List Views */}
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
                {/* Graph View - ReactFlow Canvas */}
                <div className="h-[600px] w-full bg-background border">
                  <FlowCanvas 
                    nodes={nodes} 
                    edges={edges} 
                    onNodeSelect={() => {}} 
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                {/* List View - Table */}
                <div className="border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Node Name</th>
                          <th className="text-left p-4 font-medium">Type</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Order</th>
                          <th className="text-left p-4 font-medium">Subnode</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {nodesData.map((node) => (
                          <tr key={node.id} className="border-b hover:bg-muted/30">
                            <td className="p-4 font-medium">{node.name}</td>
                            <td className="p-4">
                              <Badge variant="outline" className="capitalize">
                                {node.type}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={getStatusColor(node.status)}>
                                <Activity className="h-3 w-3 mr-1" />
                                <span className="capitalize">{node.status}</span>
                              </Badge>
                            </td>
                            <td className="p-4">
                              <span className="text-sm text-muted-foreground">
                                #{flow.nodes?.find(n => n.id === node.id)?.order || 'N/A'}
                              </span>
                            </td>
                            <td className="p-4">
                              <code className="text-xs bg-muted px-2 py-1">
                                {node.subnodeName}
                              </code>
                            </td>
                             <td className="p-4">
                               <div className="flex gap-1">
                                 <Button 
                                   size="sm" 
                                   variant="outline"
                                   onClick={() => toast({ title: "Node Started", description: `${node.name} has been started.` })}
                                   title="Start"
                                 >
                                   <Play className="h-3 w-3" />
                                 </Button>
                                 <Button 
                                   size="sm" 
                                   variant="outline"
                                   onClick={() => toast({ title: "Node Stopped", description: `${node.name} has been stopped.` })}
                                   title="Stop"
                                 >
                                   <Square className="h-3 w-3" />
                                 </Button>
                                 <Button 
                                   size="sm" 
                                   variant="outline"
                                   onClick={() => toast({ title: "Node Restarted", description: `${node.name} has been restarted.` })}
                                   title="Restart"
                                 >
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

        {/* Performance Statistics */}
        <PerformanceStats 
          throughputLastHour={520}
          eventsLastHour={flow.nodes?.length * 1000 || 0}
          eventsLast24h={flow.nodes?.length * 24000 || 0}
          eventsLast7d={flow.nodes?.length * 168000 || 0}
          errorRate={0.02}
          retryCount={5}
        />

        {/* Alerts & Logs Panel */}
        <AlertsLogsPanel />
      </div>
    </div>
  );
}