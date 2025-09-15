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
import { FlowPipeline } from "@/components/FlowPipeline";
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
  Download
} from "lucide-react";
import { PerformanceStats } from "@/pages/mediations/components/PerformanceStats";
import { AlertsLogsPanel } from "@/pages/mediations/components/AlertsLogsPanel";

// Mock data for the stream
const streamData = {
  id: "stream-001",
  name: "EBU_Bulk_SMS_LMS_TO_DWH_Non_Processing_Stream",
  status: "RUNNING",
  uptime: "14d 8h 23m",
  lastStarted: "2024-01-15 09:30:45",
  hosts: ["mediation-host-01", "mediation-host-02"],
  currentRevision: "v2.1.4",
  baseRevision: "v2.1.0",
  description: "Processes bulk SMS records from LMS system and loads into data warehouse for non-processing events."
};

const nodesData = [
  { 
    id: "collector-001", 
    name: "SMS_LMS_Collector", 
    type: "Collector", 
    status: "RUNNING", 
    scheduling: "Every 5 minutes", 
    processed: 45672, 
    errors: 12, 
    host: "mediation-host-01",
    position: { x: 100, y: 200 },
    subnodeName: "File_Collector_v2.1"
  },
  { 
    id: "processor-001", 
    name: "SMS_Validator", 
    type: "Processor", 
    status: "RUNNING", 
    scheduling: "Real-time", 
    processed: 45660, 
    errors: 0, 
    host: "mediation-host-01",
    position: { x: 300, y: 200 },
    subnodeName: "Field_Validator_v1.5"
  },
  { 
    id: "processor-002", 
    name: "SMS_Enricher", 
    type: "Processor", 
    status: "PARTIAL", 
    scheduling: "Real-time", 
    processed: 45350, 
    errors: 310, 
    host: "mediation-host-02",
    position: { x: 500, y: 200 },
    subnodeName: "Customer_Lookup_v3.0"
  },
  { 
    id: "distributor-001", 
    name: "DWH_Loader", 
    type: "Distributor", 
    status: "RUNNING", 
    scheduling: "Batch - 15 min", 
    processed: 45040, 
    errors: 0, 
    host: "mediation-host-02",
    position: { x: 700, y: 200 },
    subnodeName: "Bulk_Insert_v2.3"
  }
];

const alertsData = [
  {
    id: 1,
    type: "ERROR",
    message: "SMS_Enricher: Connection timeout to customer database",
    timestamp: "2024-01-20 14:23:45",
    acknowledged: false
  },
  {
    id: 2,
    type: "WARNING", 
    message: "High memory usage on mediation-host-02 (85%)",
    timestamp: "2024-01-20 14:15:32",
    acknowledged: false
  },
  {
    id: 3,
    type: "INFO",
    message: "Scheduled maintenance completed successfully",
    timestamp: "2024-01-20 13:45:12",
    acknowledged: true
  }
];

const performanceData = [
  { time: "14:00", processed: 3200, errors: 12 },
  { time: "14:15", processed: 3450, errors: 8 },
  { time: "14:30", processed: 3100, errors: 15 },
  { time: "14:45", processed: 3800, errors: 5 },
  { time: "15:00", processed: 3600, errors: 3 }
];

export function StreamDetailPage() {
  const { streamId } = useParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"graph" | "list">("graph");
  const [description, setDescription] = useState(streamData.description);
  const [isEditingDescription, setIsEditingDescription] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING": return "bg-success text-success-foreground";
      case "STOPPED": return "bg-destructive text-destructive-foreground";
      case "PARTIAL": return "bg-warning text-warning-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getNodeStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING": return "fill-success stroke-success";
      case "STOPPED": return "fill-destructive stroke-destructive";
      case "PARTIAL": return "fill-warning stroke-warning";
      default: return "fill-muted stroke-muted";
    }
  };

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
                Back to Dashboard
              </Button>
              
              <div className="space-y-1">
                <div className="text-xs text-muted-foreground">
                  Dashboard → Streams → {streamData.name}
                </div>
                <h1 className="text-2xl font-bold text-foreground">
                  {streamData.name}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" className="gap-2">
                <Play className="h-4 w-4" />
                Start
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <Pause className="h-4 w-4" />
                Stop  
              </Button>
              <Button size="sm" variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Restart
              </Button>
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
                <Badge className={getStatusColor(streamData.status)}>
                  {streamData.status}
                </Badge>
              </div>

              {/* Uptime */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Uptime
                </Label>
                <div className="text-sm font-medium text-foreground">{streamData.uptime}</div>
              </div>

              {/* Last Started */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Last Started</Label>
                <div className="text-sm font-medium text-foreground">2024-01-12 23:15:30</div>
              </div>

              {/* Host Count */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Server className="h-4 w-4" />
                  Host Count
                </Label>
                <div className="text-sm font-medium text-foreground">2 hosts</div>
              </div>

              {/* Version Information */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <GitBranch className="h-4 w-4" />
                  Version Information
                </Label>
                <div className="text-sm font-medium text-foreground">Current: v2</div>
                <div className="text-xs text-muted-foreground">Based on: v1</div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              {isEditingDescription ? (
                <div className="space-y-2">
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setIsEditingDescription(false)}
                    >
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setDescription(streamData.description);
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
                  {description}
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

        {/* Stream Monitoring Tabs */}
        <Tabs defaultValue="stream-live-log" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="stream-live-log" className="gap-2">
              <FileText className="h-4 w-4" />
              Stream Live Log
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

          <TabsContent value="stream-live-log" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Stream Live Log</CardTitle>
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
                    [2024-01-20 14:25:12] Stream started successfully
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:15] SMS_LMS_Collector: Processing batch 001 (45 records)
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:16] SMS_Validator: Validated 45 records, 0 errors
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-warning">
                    [2024-01-20 14:25:17] SMS_Enricher: Connection timeout to customer database, retrying...
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:20] SMS_Enricher: Retry successful, enriched 42 records
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:22] DWH_Loader: Loaded 42 records to data warehouse
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
                        <SelectItem value="collector">SMS_LMS_Collector</SelectItem>
                        <SelectItem value="validator">SMS_Validator</SelectItem>
                        <SelectItem value="enricher">SMS_Enricher</SelectItem>
                        <SelectItem value="loader">DWH_Loader</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-info">
                    [2024-01-20 14:25:12] SMS_LMS_Collector: Initializing connection to LMS database
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:13] SMS_LMS_Collector: Connection established
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:15] SMS_LMS_Collector: Query executed: SELECT * FROM sms_records WHERE processed = 0
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:15] SMS_LMS_Collector: Retrieved 45 records
                  </div>
                  <div className="text-xs text-muted-foreground p-2 border-l-2 border-success">
                    [2024-01-20 14:25:16] SMS_LMS_Collector: Batch processing completed
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            <PerformanceStats 
              throughputLastHour={520}
              eventsLastHour={15420}
              eventsLast24h={348960}
              eventsLast7d={2443200}
              errorRate={0.02}
              retryCount={15}
            />
          </TabsContent>

          <TabsContent value="alerts-logs" className="space-y-4">
            <AlertsLogsPanel />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Execution Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="priority">Default Execution Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="diagnostics">Diagnostic Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internal">Internal</SelectItem>
                        <SelectItem value="application">Application</SelectItem>
                        <SelectItem value="library">Library</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-discard">Auto-discard failed events</Label>
                    <Switch id="auto-discard" />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="compression">Enable compression</Label>
                    <Switch id="compression" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buffer-threshold">Node Buffer Threshold (%)</Label>
                  <div className="flex items-center gap-4">
                    <Input type="number" id="buffer-threshold" placeholder="85" className="w-24" />
                    <span className="text-sm text-muted-foreground">Alert when buffer exceeds this threshold</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}