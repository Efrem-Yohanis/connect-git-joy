import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";  
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Search, 
  Filter, 
  RefreshCw,
  BarChart3,
  FileText,
  Activity,
  Zap,
  Clock,
  CheckCircle2,
  AlertCircle,
  Target
} from "lucide-react";

// Mock data for reports
const mockNodeReports = [
  {
    id: "nr-001",
    nodeName: "Data Validator Node",
    status: "running",
    throughput: "1.2K/min",
    errorRate: "0.5%",
    uptime: "99.8%",
    lastProcessed: "2024-01-15 15:30:22",
    trend: "up"
  },
  {
    id: "nr-002",
    nodeName: "Enrichment Node", 
    status: "running",
    throughput: "900/min",
    errorRate: "1.2%",
    uptime: "98.5%",
    lastProcessed: "2024-01-15 15:29:45",
    trend: "down"
  },
];

const mockFlowReports = [
  {
    id: "fr-001",
    flowName: "Convergent Data Processing",
    status: "running",
    totalNodes: 8,
    activeNodes: 7,
    completionRate: "95.5%",
    avgProcessingTime: "2.3s",
    lastExecution: "2024-01-15 15:25:10",
    trend: "up"
  },
  {
    id: "fr-002",
    flowName: "Charging Flow Pipeline",
    status: "stopped",
    totalNodes: 6,
    activeNodes: 0,
    completionRate: "0%",
    avgProcessingTime: "N/A",
    lastExecution: "2024-01-15 12:15:33",
    trend: "down"
  },
];

export function ReportsPage() {
  const [activeTab, setActiveTab] = useState("node");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [timeRange, setTimeRange] = useState("24h");

  const getStatusBadge = (status: string) => {
    return status === "running" ? (
      <Badge className="bg-success text-success-foreground">Running</Badge>
    ) : (
      <Badge variant="secondary">Stopped</Badge>
    );
  };

  const getTrendIcon = (trend: string) => {
    return trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-success" />
    ) : (
      <TrendingDown className="h-4 w-4 text-destructive" />
    );
  };

  const handleExportReport = () => {
    // Handle report export logic
    console.log("Exporting report...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/20">
                <BarChart3 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Performance Reports</h1>
                <p className="text-muted-foreground">Comprehensive analytics and performance insights</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Performance Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-green-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Nodes</CardTitle>
                <Activity className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">7</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={87.5} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground">87.5%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">of 8 total nodes</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-blue-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Running Flows</CardTitle>
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">1</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={50} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground">50%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">of 2 total flows</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-purple-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Throughput</CardTitle>
                <Target className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">1.05K</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+12% from last hour</span>
              </div>
              <div className="text-xs text-muted-foreground">records/min</div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-orange-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">99.2%</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={99.2} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground">SLA</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Last 30 days</div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Management Panel */}
        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Performance Analytics Console</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Detailed metrics and performance analysis</p>
              </div>
              <div className="flex items-center gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[120px]">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">Last Hour</SelectItem>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, status, or performance metrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="stopped">Stopped</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="mb-6" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="node" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600">
                  Node Performance
                </TabsTrigger>
                <TabsTrigger value="flow" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600">
                  Flow Analytics
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="node" className="mt-0">
                <div className="rounded-lg border bg-gradient-to-br from-green-50/30 to-green-100/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-green-200/50 bg-green-50/50">
                        <TableHead className="font-semibold">Node Name</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Throughput</TableHead>
                        <TableHead className="font-semibold">Error Rate</TableHead>
                        <TableHead className="font-semibold">Uptime</TableHead>
                        <TableHead className="font-semibold">Last Processed</TableHead>
                        <TableHead className="font-semibold text-center">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockNodeReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-green-50/30 transition-colors">
                          <TableCell className="font-semibold text-foreground">{report.nodeName}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{report.throughput}</span>
                              {getTrendIcon(report.trend)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={parseFloat(report.errorRate) > 1 ? "text-red-600 font-medium" : "text-green-600 font-medium"}>
                                {report.errorRate}
                              </span>
                              {parseFloat(report.errorRate) > 1 ? (
                                <AlertCircle className="h-3 w-3 text-red-500" />
                              ) : (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={parseFloat(report.uptime) > 99 ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                                {report.uptime}
                              </span>
                              <Progress 
                                value={parseFloat(report.uptime)} 
                                className="w-16 h-1"
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{report.lastProcessed}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={report.trend === "up" ? "default" : "secondary"} className="text-xs">
                              {report.trend === "up" ? "Optimal" : "Degraded"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            
              <TabsContent value="flow" className="mt-0">
                <div className="rounded-lg border bg-gradient-to-br from-blue-50/30 to-blue-100/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-200/50 bg-blue-50/50">
                        <TableHead className="font-semibold">Flow Name</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Node Health</TableHead>
                        <TableHead className="font-semibold">Completion Rate</TableHead>
                        <TableHead className="font-semibold">Processing Time</TableHead>
                        <TableHead className="font-semibold">Last Execution</TableHead>
                        <TableHead className="font-semibold text-center">Performance</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFlowReports.map((report) => (
                        <TableRow key={report.id} className="hover:bg-blue-50/30 transition-colors">
                          <TableCell className="font-semibold text-foreground">{report.flowName}</TableCell>
                          <TableCell>{getStatusBadge(report.status)}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{report.activeNodes}/{report.totalNodes}</span>
                              <Progress 
                                value={(report.activeNodes / report.totalNodes) * 100} 
                                className="w-16 h-1"
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className={parseFloat(report.completionRate) > 90 ? "text-green-600 font-medium" : "text-orange-600 font-medium"}>
                                {report.completionRate}
                              </span>
                              {parseFloat(report.completionRate) > 90 ? (
                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                              ) : (
                                <AlertCircle className="h-3 w-3 text-orange-500" />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{report.avgProcessingTime}</span>
                              {getTrendIcon(report.trend)}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{report.lastExecution}</TableCell>
                          <TableCell className="text-center">
                            <Badge variant={report.trend === "up" ? "default" : "secondary"} className="text-xs">
                              {report.status === "running" ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}