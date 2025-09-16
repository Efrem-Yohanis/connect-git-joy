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
import { FlowPipeline } from "@/components/FlowPipeline";
import { UniformDetailHeader } from "@/components/UniformDetailHeader";
import { UniformDetailBackButton } from "@/components/UniformDetailBackButton";
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
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");

  useEffect(() => {
    const fetchFlowStructure = async () => {
      try {
        const response = await flowService.getFlow(id!);
        setFlow(response);
        setDescription(response?.description || "No description available");
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
    if (name.includes('sftp') || name.includes('collector')) return 'Collector';
    if (name.includes('fdc')) return 'Processor';
    if (name.includes('asn1') || name.includes('decoder')) return 'Decoder';
    if (name.includes('ascii')) return 'Decoder';
    if (name.includes('validation')) return 'Validator';
    if (name.includes('enrichment')) return 'Enricher';
    if (name.includes('encoder')) return 'Encoder';
    if (name.includes('diameter')) return 'Interface';
    if (name.includes('backup')) return 'Backup';
    return 'Processor';
  };

  // Create unique nodes map to avoid duplicates
  const uniqueNodes = new Map();
  flow.nodes?.forEach((node) => {
    if (!uniqueNodes.has(node.id)) {
      uniqueNodes.set(node.id, node);
    }
  });

  // Convert nodes for FlowPipeline component (same format as StreamDetailPage)
  const nodesData = Array.from(uniqueNodes.values()).map((node) => ({
    id: node.id,
    name: node.name,
    type: getNodeType(node.name),
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
  
  const getFlowStatusForBreadcrumb = () => {
    if (flow.is_deployed) return "Deployed";
    return "Draft";
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Uniform Header */}
      <UniformDetailHeader
        name={flow.name}
        version={flow.version}
        status={flow.is_running ? 'running' : flow.is_deployed ? 'deployed' : 'draft'}
        backRoute="/devtool"
        backTab="flows"
        isEditable={!flow.is_deployed}
        onEditVersion={() => navigate(`/flows/${id}/edit`)}
        onCreateNewVersion={() => toast({ title: "Create New Version", description: "Creating new version..." })}
        onToggleDeployment={() => {
          setFlow(prev => ({ ...prev, is_deployed: !prev.is_deployed }));
          toast({
            title: flow.is_deployed ? "Flow Undeployed" : "Flow Deployed",
            description: flow.is_deployed ? "Flow has been undeployed" : "Flow has been deployed successfully"
          });
        }}
        onShowVersionHistory={() => toast({ title: "Version History", description: "Opening version history..." })}
        onExportVersion={() => toast({ title: "Export Version", description: "Exporting version..." })}
        onCloneVersion={() => toast({ title: "Clone Version", description: "Cloning version..." })}
        onDeleteVersion={() => toast({ title: "Delete Version", description: "Deleting version..." })}
        customActions={[
          {
            label: "Start Flow",
            icon: Play,
            onClick: handleRunFlow,
            disabled: flow.is_running
          },
          {
            label: "Stop Flow", 
            icon: Pause,
            onClick: handleStopFlow,
            disabled: !flow.is_running
          },
          {
            label: "Restart Flow",
            icon: RotateCcw,
            onClick: () => {
              if (flow.is_running) {
                handleStopFlow();
                setTimeout(() => handleRunFlow(), 1000);
              } else {
                handleRunFlow();
              }
            }
          }
        ]}
      />

      <div className="space-y-6">
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
                  Version Information
                </Label>
                <div className="text-sm font-medium text-foreground">Current: v{flow.version}</div>
                <div className="text-xs text-muted-foreground">Based on: v{Math.max(1, flow.version - 1)}</div>
              </div>

              {/* Node Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Network className="h-4 w-4" />
                  Host Count
                </Label>
                <div className="text-sm font-medium text-foreground">2 hosts</div>
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
                  Last Started
                </Label>
                <div className="text-sm font-medium text-foreground">
                  {flow.updated_at ? new Date(flow.updated_at).toLocaleString() : '2024-01-12 23:15:30'}
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
                  className="text-sm text-foreground p-3 rounded-md bg-muted/50 cursor-pointer hover:bg-muted"
                  onClick={() => setIsEditingDescription(true)}
                >
                  {description || "Click to add description..."}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Flow / Nodes View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Flow Pipeline
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "graph" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("graph")}
                  className="gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Graph View
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="gap-2"
                >
                  <List className="h-4 w-4" />
                  List View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "graph" ? (
              <FlowPipeline nodesData={nodesData} />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Node Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Scheduling</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Processed</TableHead>
                    <TableHead>Errors</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {nodesData.map((node) => (
                    <TableRow key={node.id}>
                      <TableCell className="font-medium">{node.name}</TableCell>
                      <TableCell>{node.type}</TableCell>
                      <TableCell>{node.scheduling}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(node.status)}>
                          {node.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{node.processed.toLocaleString()}</TableCell>
                      <TableCell>{node.errors}</TableCell>
                      <TableCell>{node.host}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Play className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <Pause className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Flow Monitoring Tabs */}
        <Tabs defaultValue="flow-live-log" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="flow-live-log" className="gap-2">
              <FileText className="h-4 w-4" />
              Flow Live Log
            </TabsTrigger>
            <TabsTrigger value="node-live-log" className="gap-2">
              <Activity className="h-4 w-4" />
              Node Live Log
            </TabsTrigger>
            <TabsTrigger value="statistics" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Statistics
            </TabsTrigger>
            <TabsTrigger value="alerts-logs" className="gap-2">
              <Bell className="h-4 w-4" />
              Alerts & Logs
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" />
              Execution Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="flow-live-log" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Flow Live Log</CardTitle>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-info">
                    [2024-01-20 14:25:12] Flow started successfully
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:15] Processing batch 001 (45 records)
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:16] Validated 45 records, 0 errors
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-warning">
                    [2024-01-20 14:25:17] Connection timeout, retrying...
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:20] Retry successful, processed 42 records
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:22] Loaded 42 records to data warehouse
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="node-live-log" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Node Live Log</CardTitle>
                  <div className="flex gap-2">
                    <Select>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodesData.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            {node.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button size="sm" variant="outline">
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:15] Node initialized successfully
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:16] Processing batch 001 (45 records)
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:17] Batch processed successfully
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <PerformanceStats 
              throughputLastHour={Math.floor(Math.random() * 50000) + 10000}
              eventsLastHour={Math.floor(Math.random() * 100000) + 20000}
              eventsLast24h={Math.floor(Math.random() * 1000000) + 500000}
              eventsLast7d={Math.floor(Math.random() * 5000000) + 2000000}
              errorRate={Math.random() * 5}
              retryCount={Math.floor(Math.random() * 100)}
            />
          </TabsContent>

          <TabsContent value="alerts-logs" className="space-y-4">
            <AlertsLogsPanel />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Settings</CardTitle>
                <CardDescription>
                  Configure flow execution parameters and behavior
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Max Concurrent Nodes</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Retry Attempts</Label>
                    <Input type="number" defaultValue="3" />
                  </div>
                  <div className="space-y-2">
                    <Label>Timeout (seconds)</Label>
                    <Input type="number" defaultValue="300" />
                  </div>
                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select defaultValue="normal">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Restart on Failure</Label>
                    <div className="text-sm text-muted-foreground">
                      Automatically restart the flow if it fails
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Monitoring</Label>
                    <div className="text-sm text-muted-foreground">
                      Send performance metrics and alerts
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="pt-4">
                  <Button>Save Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back Button */}
        <UniformDetailBackButton backRoute="/devtool" backTab="flows" />
      </div>
    </div>
  );
}