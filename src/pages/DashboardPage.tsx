import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database, 
  GitFork, 
  Network, 
  Plus, 
  Settings, 
  TrendingUp, 
  Users, 
  Workflow,
  Zap,
  BarChart3,
  PieChart,
  Monitor,
  Server,
  Cpu,
  HardDrive,
  MemoryStick,
  Wifi,
  Eye,
  RefreshCw,
  Bell,
  ArrowUp,
  ArrowDown,
  Pause,
  Play,
  Square,
  Target,
  Gauge,
  Timer,
  AlertCircle,
  Layers,
  GitBranch
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useItems } from './apis/ItemService';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Pie } from 'recharts';

// Global KPI Metrics
const globalKPIs = [
  {
    title: "Active Flows",
    value: "47",
    total: "52 Total",
    change: "+3.2%",
    trend: "up",
    icon: Workflow,
    color: "text-primary",
    bgColor: "bg-primary/10",
    status: "healthy"
  },
  {
    title: "Throughput",
    value: "12.4K",
    total: "events/sec",
    change: "+15.2%",
    trend: "up",
    icon: Gauge,
    color: "text-success",
    bgColor: "bg-success/10",
    status: "healthy"
  },
  {
    title: "Avg Latency", 
    value: "142ms",
    total: "end-to-end",
    change: "-8.1%",
    trend: "down",
    icon: Timer,
    color: "text-info",
    bgColor: "bg-info/10",
    status: "optimal"
  },
  {
    title: "Error Rate",
    value: "0.12%",
    total: "of events",
    change: "-2.3%", 
    trend: "down",
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    status: "warning"
  },
  {
    title: "Queue Backlog",
    value: "2.1K",
    total: "messages",
    change: "+5.8%",
    trend: "up", 
    icon: Database,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    status: "alert"
  },
  {
    title: "CPU Usage",
    value: "67%",
    total: "cluster avg",
    change: "+12%",
    trend: "up",
    icon: Cpu,
    color: "text-info",
    bgColor: "bg-info/10",
    status: "healthy"
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
  const { data: flows } = useItems();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");
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
      case "healthy": return "text-success";
      case "degraded": return "text-warning";
      case "failed": return "text-destructive";
      case "running": return "text-success";
      case "stopped": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string, health?: string) => {
    const displayStatus = health || status;
    const variant = displayStatus === "healthy" || displayStatus === "running" ? "default" :
                   displayStatus === "degraded" || displayStatus === "warning" ? "secondary" : 
                   "destructive";
    
    return (
      <Badge variant={variant} className="text-xs">
        {displayStatus}
      </Badge>
    );
  };

  const getHealthStats = () => {
    const healthy = flowsData.filter(f => f.health === "healthy").length;
    const degraded = flowsData.filter(f => f.health === "degraded").length;
    const failed = flowsData.filter(f => f.health === "failed").length;
    const total = flowsData.length;
    
    return [
      { name: 'Healthy', value: healthy, color: COLORS[0] },
      { name: 'Degraded', value: degraded, color: COLORS[1] },
      { name: 'Failed', value: failed, color: COLORS[2] }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="space-y-6 p-6">
        {/* Header */}
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
                      Mediation Control Center
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Real-time monitoring and control of your data processing flows
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
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
                <div className="flex flex-col items-end gap-1">
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

        {/* Global KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {globalKPIs.map((kpi, index) => (
            <Card 
              key={kpi.title}
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 shadow-subtle hover:shadow-card transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-md ${kpi.bgColor}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${kpi.trend === 'up' ? 'text-success border-success/30' : 'text-info border-info/30'}`}
                  >
                    {kpi.trend === 'up' ? <ArrowUp className="h-3 w-3 mr-1" /> : <ArrowDown className="h-3 w-3 mr-1" />}
                    {kpi.change}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <div className="text-xl font-bold text-foreground">
                    {kpi.value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {kpi.title}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {kpi.total}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-card/50 border border-border/50">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Monitor className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="flows" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Workflow className="h-4 w-4 mr-2" />
              Flows
            </TabsTrigger>
            <TabsTrigger value="nodes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Network className="h-4 w-4 mr-2" />
              Nodes
            </TabsTrigger>
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                {/* Performance Charts */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Performance Metrics
                    </CardTitle>
                    <CardDescription>Real-time system performance over 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={performanceData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                          <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))',
                              borderRadius: '8px'
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="throughput" 
                            stroke="hsl(var(--primary))" 
                            fill="hsl(var(--primary))"
                            fillOpacity={0.2}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* System Resources */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      System Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Cpu className="h-4 w-4 text-info" />
                            <span className="text-sm font-medium">CPU Usage</span>
                          </div>
                          <span className="text-sm text-muted-foreground">67%</span>
                        </div>
                        <Progress value={67} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-warning" />
                            <span className="text-sm font-medium">Memory</span>
                          </div>
                          <span className="text-sm text-muted-foreground">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-success" />
                            <span className="text-sm font-medium">Storage</span>
                          </div>
                          <span className="text-sm text-muted-foreground">45%</span>
                        </div>
                        <Progress value={45} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Network I/O</span>
                          </div>
                          <span className="text-sm text-muted-foreground">34%</span>
                        </div>
                        <Progress value={34} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {/* Flow Health Distribution */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-primary" />
                      Flow Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Tooltip />
                          <Pie
                            data={getHealthStats()}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, value }) => `${name}: ${value}`}
                          >
                            {getHealthStats().map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* System Status */}
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-success" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-success">{flowsData.filter(f => f.status === 'running').length}</div>
                        <div className="text-xs text-muted-foreground">Running</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xl font-bold text-muted-foreground">{flowsData.filter(f => f.status === 'stopped').length}</div>
                        <div className="text-xs text-muted-foreground">Stopped</div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                          <span className="text-sm">System Operational</span>
                        </div>
                        <Badge variant="outline" className="text-success border-success/30">
                          99.8%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Flows Tab */}
          <TabsContent value="flows" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-primary" />
                      Flow Management
                    </CardTitle>
                    <CardDescription>Monitor and manage data processing flows</CardDescription>
                  </div>
                  <Button onClick={() => navigate("/flows")}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Flow
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {flowsData.map((flow) => (
                    <Card key={flow.id} className="border-border/50 hover:border-primary/30 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Workflow className={`h-4 w-4 ${getStatusColor(flow.health)}`} />
                              <span className="font-medium">{flow.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(flow.status, flow.health)}
                              <Badge variant="outline" className="text-xs">
                                {flow.nodes} nodes
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => navigate(`/flows/${flow.id}`)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Throughput</div>
                            <div className="font-medium">{flow.throughput.toLocaleString()} evt/s</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Queue Size</div>
                            <div className="font-medium">{flow.queueSize.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Latency</div>
                            <div className="font-medium">{flow.latency}ms</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">SLA</div>
                            <div className="font-medium">{flow.slaCompliance}%</div>
                          </div>
                        </div>

                        {flow.errorCount > 0 && (
                          <Alert className="mt-3 border-warning/30 bg-warning/5">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>
                              {flow.errorCount} errors detected in the last hour
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nodes Tab */}
          <TabsContent value="nodes" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="h-5 w-5 text-primary" />
                  Node Performance
                </CardTitle>
                <CardDescription>Monitor individual processing nodes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {nodesData.map((node) => (
                    <Card key={node.id} className="border-border/50">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Network className={`h-4 w-4 ${getStatusColor(node.status)}`} />
                              <span className="font-medium">{node.name}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {node.type}
                            </Badge>
                            {getStatusBadge(node.status)}
                          </div>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <div className="text-muted-foreground">Input Rate</div>
                            <div className="font-medium">{node.inputRate}/s</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Output Rate</div>
                            <div className="font-medium">{node.outputRate}/s</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Queue</div>
                            <div className="font-medium">{node.queueSize}</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Latency</div>
                            <div className="font-medium">{node.latency}ms</div>
                          </div>
                          <div>
                            <div className="text-muted-foreground">Errors</div>
                            <div className="font-medium">{node.errorCount}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts" className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  System Alerts
                </CardTitle>
                <CardDescription>Critical notifications and warnings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertsData.map((alert) => (
                    <Alert 
                      key={alert.id} 
                      className={`${
                        alert.type === 'critical' ? 'border-destructive/30 bg-destructive/5' :
                        alert.type === 'warning' ? 'border-warning/30 bg-warning/5' :
                        'border-info/30 bg-info/5'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {alert.type === 'critical' ? 
                            <AlertCircle className="h-4 w-4 text-destructive mt-0.5" /> :
                            alert.type === 'warning' ?
                            <AlertTriangle className="h-4 w-4 text-warning mt-0.5" /> :
                            <Bell className="h-4 w-4 text-info mt-0.5" />
                          }
                          <div className="space-y-1">
                            <div className="font-medium">{alert.title}</div>
                            <AlertDescription className="text-sm">
                              {alert.description}
                            </AlertDescription>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {new Date(alert.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!alert.acknowledged && (
                            <Badge variant="destructive" className="text-xs">
                              New
                            </Badge>
                          )}
                          <Button variant="outline" size="sm">
                            Acknowledge
                          </Button>
                        </div>
                      </div>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}