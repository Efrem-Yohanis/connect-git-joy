import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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


  return (
    <main className="min-h-screen bg-background p-8 space-y-6">
      {/* Simple Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Nodes</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.totalNodes}</p>
            <p className="text-xs text-muted-foreground">{summaryMetrics.activeNodes} Active</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Health Status</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.optimalNodes}</p>
            <p className="text-xs text-muted-foreground">{summaryMetrics.warningNodes} Warning</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Executions</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.totalExecutions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Operations</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Resource Usage</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.avgCpuUsage}</p>
            <p className="text-xs text-muted-foreground">{summaryMetrics.avgMemoryUsage} Memory</p>
          </CardContent>
        </Card>
      </div>

      {/* Simple Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
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
            </div>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardContent>
      </Card>

      {/* Simple Node Table */}
      <Card>
        <CardHeader>
          <CardTitle>Node Performance Analytics</CardTitle>
          <CardDescription>Resource utilization and execution statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Node Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Resource Usage</TableHead>
                <TableHead>Uptime</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.nodeName}</p>
                      <p className="text-sm text-muted-foreground">{report.version}</p>
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
                    <span className="font-medium">{report.successRate}%</span>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">CPU: <span className="font-medium">{report.cpuUsage}</span></p>
                      <p className="text-sm">Memory: <span className="font-medium">{report.memoryUsage}</span></p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{report.uptime}</TableCell>
                  <TableCell className="font-medium">{report.trend}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}