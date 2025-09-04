import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Square, Settings, Activity, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FlowDetail {
  id: string;
  name: string;
  type: string;
  status: "running" | "stopped" | "error";
  description: string;
  lastRun: string;
  processedRecords: number;
  errorRate: number;
}

const mockFlowData: Record<string, FlowDetail> = {
  "1": {
    id: "1",
    name: "Charging Stream A",
    type: "charging",
    status: "running",
    description: "Processes charging events from the billing system",
    lastRun: "2024-01-15 14:30:00",
    processedRecords: 15420,
    errorRate: 0.02
  },
  "2": {
    id: "2", 
    name: "Charging Stream B",
    type: "charging",
    status: "stopped",
    description: "Handles backup charging event processing",
    lastRun: "2024-01-15 12:15:00",
    processedRecords: 8930,
    errorRate: 0.01
  },
  "3": {
    id: "3",
    name: "Convergent Stream A", 
    type: "convergent",
    status: "running",
    description: "Main convergent billing mediation stream",
    lastRun: "2024-01-15 14:35:00",
    processedRecords: 23450,
    errorRate: 0.03
  },
  "4": {
    id: "4",
    name: "Convergent Stream B",
    type: "convergent", 
    status: "error",
    description: "Secondary convergent processing stream",
    lastRun: "2024-01-15 13:20:00",
    processedRecords: 12340,
    errorRate: 0.15
  },
  "5": {
    id: "5",
    name: "NCC Stream A",
    type: "ncc",
    status: "running", 
    description: "Network call control mediation processing",
    lastRun: "2024-01-15 14:40:00",
    processedRecords: 9876,
    errorRate: 0.001
  },
  "6": {
    id: "6",
    name: "NCC Stream B",
    type: "ncc",
    status: "stopped",
    description: "Backup NCC mediation stream",
    lastRun: "2024-01-15 11:45:00", 
    processedRecords: 5432,
    errorRate: 0.005
  }
};

export function MediationFlowDetailPage() {
  const { flowId } = useParams<{ flowId: string }>();
  const navigate = useNavigate();
  
  const flow = flowId ? mockFlowData[flowId] : null;

  if (!flow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground">Flow Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested mediation flow does not exist.</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-green-100 text-green-800 border-green-200";
      case "stopped": return "bg-gray-100 text-gray-800 border-gray-200"; 
      case "error": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Play className="h-4 w-4" />;
      case "stopped": return <Square className="h-4 w-4" />;
      case "error": return <Activity className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{flow.name}</h1>
          <p className="text-muted-foreground">{flow.description}</p>
        </div>
      </div>

      {/* Status and Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge className={getStatusColor(flow.status)}>
            {getStatusIcon(flow.status)}
            <span className="ml-1 capitalize">{flow.status}</span>
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            Last run: {flow.lastRun}
          </div>
        </div>
        
        <div className="flex gap-2">
          {flow.status === "stopped" && (
            <Button size="sm" className="bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          {flow.status === "running" && (
            <Button variant="outline" size="sm">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Processed Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{flow.processedRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total processed today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(flow.errorRate * 100).toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground">Processing errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stream Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{flow.type}</div>
            <p className="text-xs text-muted-foreground">Mediation type</p>
          </CardContent>
        </Card>
      </div>

      {/* Flow Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Flow Configuration</CardTitle>
          <CardDescription>
            Current configuration settings for this mediation flow
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Input Source</label>
              <p className="text-sm text-muted-foreground">Database queue: {flow.type}_input_queue</p>
            </div>
            <div>
              <label className="text-sm font-medium">Output Target</label>
              <p className="text-sm text-muted-foreground">File system: /data/processed/{flow.type}/</p>
            </div>
            <div>
              <label className="text-sm font-medium">Batch Size</label>
              <p className="text-sm text-muted-foreground">1000 records per batch</p>
            </div>
            <div>
              <label className="text-sm font-medium">Processing Interval</label>
              <p className="text-sm text-muted-foreground">Every 30 seconds</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}