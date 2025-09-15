import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Monitor,
  RefreshCw,
  Bell,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  Square,
  AlertCircle,
  FileText,
  EyeOff,
  StickyNote,
  Info,
  Zap,
  TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useItems } from './apis/ItemService';

// Stream Data - Professional Mediation Dashboard
const streamsData = [
  {
    id: "stream-001",
    name: "SFC_ETH_6D_BSS_TO_NOKIA_DWH_STREAM",
    errors: 22067,
    warnings: 0,
    instances: 1,
    status: "RUNNING",
    uptime: "14d 8h 23m",
    lastActivity: "2 seconds ago",
    throughput: "3.2K/sec"
  },
  {
    id: "stream-002", 
    name: "SFC_ETH_COLLAB_TO_DWH_STREAM",
    errors: 0,
    warnings: 12,
    instances: 1,
    status: "STOPPED",
    uptime: "0h",
    lastActivity: "45 minutes ago",
    throughput: "0/sec"
  },
  {
    id: "stream-003",
    name: "BILLING_MEDIATION_CORE_STREAM",
    errors: 156,
    warnings: 89,
    instances: 1,
    status: "PARTIAL",
    uptime: "6d 12h 45m",
    lastActivity: "1 second ago",
    throughput: "1.8K/sec"
  },
  {
    id: "stream-004",
    name: "CDR_PROCESSING_MAIN_STREAM",
    errors: 8,
    warnings: 156,
    instances: 1,
    status: "RUNNING",
    uptime: "22d 3h 12m",
    lastActivity: "1 second ago",
    throughput: "5.6K/sec"
  },
  {
    id: "stream-005",
    name: "NETWORK_EVENTS_COLLECTOR_STREAM",
    errors: 0,
    warnings: 3,
    instances: 1,
    status: "RUNNING",
    uptime: "8d 15h 32m",
    lastActivity: "3 seconds ago",
    throughput: "2.1K/sec"
  }
];

// Alerts Summary
const alertsSummary = {
  totalErrors: 22088,
  totalWarnings: 237,
  totalInfo: 72
};

// Peak Streams (highest activity)
const peakStreams = [
  {
    name: "CDR_PROCESSING_MAIN_STREAM",
    throughput: "5.6K/sec",
    uptime: "22d 3h",
    errorRate: "0.02%"
  },
  {
    name: "SFC_ETH_6D_BSS_TO_NOKIA_DWH_STREAM", 
    throughput: "3.2K/sec",
    uptime: "14d 8h",
    errorRate: "1.2%"
  },
  {
    name: "NETWORK_EVENTS_COLLECTOR_STREAM",
    throughput: "2.1K/sec", 
    uptime: "8d 15h",
    errorRate: "0.01%"
  }
];

// Mock Flow Data
const flowsData = [
  {
    id: "flow-001",
    name: "Customer Data ETL",
    status: "running",
    health: "healthy",
    throughput: 3420,
    queueSize: 125,
    errorCount: 0,
    latency: 89,
    slaCompliance: 99.8,
    lastUpdated: "2024-01-15T10:30:00Z",
    nodes: 6,
    uptime: "14d 8h"
  },
  {
    id: "flow-002", 
    name: "Billing Mediation",
    status: "running",
    health: "degraded",
    throughput: 2180,
    queueSize: 892,
    errorCount: 12,
    latency: 245,
    slaCompliance: 94.2,
    lastUpdated: "2024-01-15T10:29:45Z",
    nodes: 8,
    uptime: "6d 12h"
  },
  {
    id: "flow-003",
    name: "Network Events",
    status: "running", 
    health: "healthy",
    throughput: 5680,
    queueSize: 45,
    errorCount: 2,
    latency: 156,
    slaCompliance: 98.9,
    lastUpdated: "2024-01-15T10:30:15Z",
    nodes: 4,
    uptime: "22d 3h"
  },
  {
    id: "flow-004",
    name: "CDR Processing",
    status: "stopped",
    health: "failed",
    throughput: 0,
    queueSize: 0,
    errorCount: 45,
    latency: 0,
    slaCompliance: 0,
    lastUpdated: "2024-01-15T09:15:22Z",
    nodes: 5,
    uptime: "0h"
  }
];

// Mock Node Data
const nodesData = [
  {
    id: "node-001",
    name: "SftpCollector-01",
    type: "Collector",
    status: "active",
    inputRate: 1240,
    outputRate: 1238,
    queueSize: 15,
    latency: 45,
    errorCount: 2,
    flowId: "flow-001"
  },
  {
    id: "node-002", 
    name: "ValidationBLN-01",
    type: "Validator",
    status: "active",
    inputRate: 1238,
    outputRate: 1235,
    queueSize: 8,
    latency: 12,
    errorCount: 3,
    flowId: "flow-001"
  },
  {
    id: "node-003",
    name: "EnrichmentBLN-01", 
    type: "Enricher",
    status: "degraded",
    inputRate: 2180,
    outputRate: 2168,
    queueSize: 245,
    latency: 156,
    errorCount: 12,
    flowId: "flow-002"
  }
];

// Performance Chart Data
const performanceData = [
  { time: '00:00', throughput: 8500, latency: 120, errors: 15 },
  { time: '02:00', throughput: 7200, latency: 118, errors: 12 },
  { time: '04:00', throughput: 6800, latency: 115, errors: 8 },
  { time: '06:00', throughput: 9200, latency: 125, errors: 18 },
  { time: '08:00', throughput: 12400, latency: 142, errors: 22 },
  { time: '10:00', throughput: 11800, latency: 138, errors: 19 },
  { time: '12:00', throughput: 13200, latency: 155, errors: 25 },
  { time: '14:00', throughput: 12800, latency: 148, errors: 21 },
  { time: '16:00', throughput: 14500, latency: 162, errors: 28 },
  { time: '18:00', throughput: 13900, latency: 159, errors: 24 },
  { time: '20:00', throughput: 11200, latency: 145, errors: 16 },
  { time: '22:00', throughput: 9800, latency: 132, errors: 13 }
];

// Alert Data
const alertsData = [
  {
    id: 1,
    type: "critical",
    title: "Flow CDR Processing Stopped",
    description: "Flow has been down for 45 minutes due to database connection failure",
    timestamp: "2024-01-15T09:15:22Z",
    flowId: "flow-004",
    acknowledged: false
  },
  {
    id: 2,
    type: "warning", 
    title: "High Queue Backlog in Billing Mediation",
    description: "Queue size has exceeded threshold (800+ messages)",
    timestamp: "2024-01-15T10:20:15Z",
    flowId: "flow-002",
    acknowledged: false
  },
  {
    id: 3,
    type: "info",
    title: "Scheduled Maintenance Complete",
    description: "Network Events flow maintenance completed successfully",
    timestamp: "2024-01-15T08:30:00Z", 
    flowId: "flow-003",
    acknowledged: true
  }
];

const COLORS = ['hsl(var(--success))', 'hsl(var(--warning))', 'hsl(var(--destructive))', 'hsl(var(--muted))'];


export function DashboardPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING": return "text-success";
      case "PARTIAL": return "text-warning";
      case "STOPPED": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "RUNNING" ? "default" :
                   status === "PARTIAL" ? "secondary" : 
                   "destructive";
    
    return (
      <Badge variant={variant} className="text-xs font-medium">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="space-y-6 p-6">
        {/* Dashboard Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 rounded-2xl" />
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Monitor className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      Stream Monitoring Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Real-time monitoring and control of mediation streams
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Dashboard Controls - Removed as requested */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="h-9"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="flex flex-col items-end gap-1 ml-4">
                  <div className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString()}
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="bg-success/5 border-success/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Play className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {streamsData.filter(stream => stream.status === "RUNNING").length}
                  </div>
                  <div className="text-sm text-muted-foreground">All Running Streams</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-destructive/5 border-destructive/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Square className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {streamsData.filter(stream => stream.status === "STOPPED").length}
                  </div>
                  <div className="text-sm text-muted-foreground">All Stopped Streams</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {streamsData.length}
                  </div>
                  <div className="text-sm text-muted-foreground">All Streams</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    22,088
                  </div>
                  <div className="text-sm text-muted-foreground">Total Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warning/5 border-warning/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    237
                  </div>
                  <div className="text-sm text-muted-foreground">Total Warnings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-info/5 border-info/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Info className="h-5 w-5 text-info" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-info">
                    72
                  </div>
                  <div className="text-sm text-muted-foreground">Info Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streams Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Streams</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="status-filter" className="text-sm font-medium text-muted-foreground">
                    Filter by:
                  </label>
                  <select 
                    id="status-filter"
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    defaultValue="all"
                  >
                    <option value="all">All Status</option>
                    <option value="RUNNING">Running</option>
                    <option value="STOPPED">Stopped</option>
                    <option value="PARTIAL">Partial</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search flows..."
                    className="h-9 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Stream Name
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Errors / Warnings  
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Instances
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Status
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Throughput
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {streamsData.slice(0, 10).map((stream) => (
                      <tr 
                        key={stream.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/streams/${stream.id}`)}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {stream.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${stream.errors > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {stream.errors.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span className={`font-medium ${stream.warnings > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                              {stream.warnings}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {stream.instances}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(stream.status)}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {stream.throughput}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Showing 1 to {streamsData.length} of {streamsData.length} flows
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Performance Streams section removed as requested */}
      </div>
    </div>
  );
}