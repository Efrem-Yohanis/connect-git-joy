import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Activity, Cpu, HardDrive, Clock, Server, CheckCircle, AlertTriangle, Filter, Calendar, Download } from "lucide-react";

export function NodeReportPage() {
  const summaryMetrics = {
    totalNodes: 24,
    activeNodes: 18,
    optimalNodes: 15,
    warningNodes: 3,
    criticalNodes: 0,
    totalExecutions: 89432,
    avgCpuUsage: "28%",
    avgMemoryUsage: "456 MB"
  };

  const reports = [
    {
      id: 1,
      nodeName: "SFTP Collector",
      version: "v1.2.0",
      type: "Collector",
      executionCount: 2450,
      successCount: 2396,
      failureCount: 54,
      successRate: 97.8,
      avgProcessingTime: "45 seconds",
      memoryUsage: "512 MB",
      peakMemoryUsage: "687 MB",
      cpuUsage: "23%",
      peakCpuUsage: "78%",
      lastUsed: "2025-08-21 11:50:00",
      uptime: "28 days",
      status: "optimal",
      trend: "up",
      host: "bp-nm-app01-vip.safaricomet.net",
      errorTypes: ["Connection timeout", "Authentication failed"]
    },
    {
      id: 2,
      nodeName: "Data Validator",
      version: "v2.1.0",
      type: "Validator", 
      executionCount: 1890,
      successCount: 1748,
      failureCount: 142,
      successRate: 92.5,
      avgProcessingTime: "1.2 minutes",
      memoryUsage: "768 MB",
      peakMemoryUsage: "1.2 GB",
      cpuUsage: "45%",
      peakCpuUsage: "89%",
      lastUsed: "2025-08-21 11:35:00",
      uptime: "15 days",
      status: "warning",
      trend: "down",
      host: "bp-nm-app02-vip.safaricomet.net",
      errorTypes: ["Memory exceeded", "Validation timeout"]
    },
    {
      id: 3,
      nodeName: "ASN.1 Decoder",
      version: "v1.0.5",
      type: "Decoder",
      executionCount: 3200,
      successCount: 3174,
      failureCount: 26,
      successRate: 99.2,
      avgProcessingTime: "30 seconds",
      memoryUsage: "256 MB",
      peakMemoryUsage: "398 MB",
      cpuUsage: "18%",
      peakCpuUsage: "42%",
      lastUsed: "2025-08-21 11:40:00",
      uptime: "45 days",
      status: "optimal",
      trend: "stable",
      host: "bp-nm-app03-vip.safaricomet.net",
      errorTypes: ["Malformed packet"]
    },
    {
      id: 4,
      nodeName: "Enrichment BLN",
      version: "v1.3.2",
      type: "Enrichment",
      executionCount: 1567,
      successCount: 1534,
      failureCount: 33,
      successRate: 97.9,
      avgProcessingTime: "2.1 minutes",
      memoryUsage: "892 MB",
      peakMemoryUsage: "1.4 GB",
      cpuUsage: "34%",
      peakCpuUsage: "67%",
      lastUsed: "2025-08-21 11:25:00",
      uptime: "22 days",
      status: "optimal",
      trend: "up",
      host: "bp-nm-app04-vip.safaricomet.net",
      errorTypes: ["Database timeout", "Lookup failed"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-secondary text-secondary-foreground';
      case 'critical': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
      case 'stable': return <Activity className="h-4 w-4 text-muted-foreground" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Node Reports</h1>
            <p className="text-muted-foreground">Detailed node performance metrics and resource utilization</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Nodes</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalNodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-success">{summaryMetrics.activeNodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Optimal</p>
                <p className="text-2xl font-bold text-success">{summaryMetrics.optimalNodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Warning</p>
                <p className="text-2xl font-bold text-warning">{summaryMetrics.warningNodes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Executions</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalExecutions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Cpu className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Avg CPU</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.avgCpuUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Memory</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.avgMemoryUsage}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Node Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Nodes</SelectItem>
              <SelectItem value="optimal">Optimal</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-types">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Node Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="collector">Collector</SelectItem>
              <SelectItem value="validator">Validator</SelectItem>
              <SelectItem value="decoder">Decoder</SelectItem>
              <SelectItem value="enrichment">Enrichment</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input type="date" className="w-auto" placeholder="From" />
            <Input type="date" className="w-auto" placeholder="To" />
          </div>
        </div>
      </div>

      {/* Detailed Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Node Performance Analysis</CardTitle>
          <CardDescription>Comprehensive resource utilization and execution statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>CPU Usage</TableHead>
                <TableHead>Memory Usage</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.nodeName}</p>
                      <p className="text-xs text-muted-foreground">{report.version}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.executionCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.successCount} success, {report.failureCount} failed
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${report.successRate >= 98 ? 'text-success' : report.successRate >= 95 ? 'text-warning' : 'text-destructive'}`}>
                      {report.successRate}%
                    </span>
                  </TableCell>
                  <TableCell>{report.avgProcessingTime}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.cpuUsage}</p>
                      <p className="text-xs text-muted-foreground">Peak: {report.peakCpuUsage}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.memoryUsage}</p>
                      <p className="text-xs text-muted-foreground">Peak: {report.peakMemoryUsage}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{report.uptime}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.host}</TableCell>
                  <TableCell>{getTrendIcon(report.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Resource Utilization Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization Overview</CardTitle>
            <CardDescription>Current resource usage across all nodes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Cpu className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{report.nodeName}</p>
                      <p className="text-xs text-muted-foreground">{report.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-medium">{report.cpuUsage}</p>
                      <p className="text-xs text-muted-foreground">CPU</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium">{report.memoryUsage}</p>
                      <p className="text-xs text-muted-foreground">Memory</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Error Analysis</CardTitle>
            <CardDescription>Recurring issues across nodes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{report.nodeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {report.failureCount} failures out of {report.executionCount} executions
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {report.errorTypes.map((error, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {error}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}