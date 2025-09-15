import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart3, TrendingUp, TrendingDown, Activity, Cpu, HardDrive, Clock, Server, CheckCircle, AlertTriangle, Filter, Calendar, Download, Shield, Database } from "lucide-react";

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
      case 'warning': return 'bg-warning text-warning-foreground';
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
    <main className="min-h-screen bg-background p-8 space-y-8">
      {/* Professional Summary Metrics - Reduced to 4 key cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card hover-scale animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10">
              <Server className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Nodes</p>
              <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalNodes}</p>
              <p className="text-xs text-muted-foreground">{summaryMetrics.activeNodes} Active</p>
            </div>
          </div>
        </div>

        <div className="metric-card hover-scale animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-success/10">
              <CheckCircle className="h-6 w-6 text-success" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health Status</p>
              <p className="text-2xl font-bold text-success">{summaryMetrics.optimalNodes}</p>
              <p className="text-xs text-muted-foreground">{summaryMetrics.warningNodes} Warning</p>
            </div>
          </div>
        </div>

        <div className="metric-card hover-scale animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-info/10">
              <BarChart3 className="h-6 w-6 text-info" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Executions</p>
              <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalExecutions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Operations</p>
            </div>
          </div>
        </div>

        <div className="metric-card hover-scale animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-muted/10">
              <Cpu className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resource Usage</p>
              <p className="text-2xl font-bold text-foreground">{summaryMetrics.avgCpuUsage}</p>
              <p className="text-xs text-muted-foreground">{summaryMetrics.avgMemoryUsage} Memory</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Filters Section */}
      <div className="professional-card p-8 animate-slide-up">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Select defaultValue="all">
              <SelectTrigger className="w-48 h-12 bg-background/80 border-border/60">
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
              <SelectTrigger className="w-48 h-12 bg-background/80 border-border/60">
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
          </div>
        </div>
      </div>

      {/* Professional Node Table */}
      <div className="professional-card overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10">
              <Database className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Node Performance Analytics</h2>
              <p className="text-muted-foreground">Comprehensive resource utilization and execution statistics</p>
            </div>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border/40 bg-muted/10">
              <TableHead className="font-semibold text-foreground py-4 px-6">Node Name</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Type</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Status</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Success Rate</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Resource Usage</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Uptime</TableHead>
              <TableHead className="font-semibold text-foreground py-4">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report, index) => (
              <TableRow 
                key={report.id} 
                className="border-border/30 hover:bg-muted/5 surface-interactive"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TableCell className="py-4 px-6">
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{report.nodeName}</p>
                    <p className="text-sm text-muted-foreground">{report.version}</p>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <Badge variant="outline" className="font-medium">{report.type}</Badge>
                </TableCell>
                <TableCell className="py-4">
                  <Badge className={getStatusColor(report.status)}>
                    {report.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="py-4">
                  <span className={`font-semibold ${report.successRate >= 98 ? 'text-success' : report.successRate >= 95 ? 'text-warning' : 'text-destructive'}`}>
                    {report.successRate}%
                  </span>
                </TableCell>
                <TableCell className="py-4">
                  <div className="space-y-1">
                    <p className="text-sm">CPU: <span className="font-medium">{report.cpuUsage}</span></p>
                    <p className="text-sm">Memory: <span className="font-medium">{report.memoryUsage}</span></p>
                  </div>
                </TableCell>
                <TableCell className="py-4 font-medium">{report.uptime}</TableCell>
                <TableCell className="py-4">{getTrendIcon(report.trend)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}