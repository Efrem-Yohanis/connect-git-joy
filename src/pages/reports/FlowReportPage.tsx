import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, TrendingUp, TrendingDown, Activity, BarChart3, Clock, CheckCircle, XCircle, Filter, Calendar, Download } from "lucide-react";

export function FlowReportPage() {
  const summaryMetrics = {
    totalFlows: 12,
    activeFlows: 8,
    totalExecutions: 45267,
    avgSuccessRate: 96.8,
    totalDataProcessed: "2.3 TB",
    avgExecutionTime: "3.2 minutes"
  };

  const reports = [
    {
      id: 1,
      flowName: "SFTP Data Collection",
      executionCount: 1250,
      successCount: 1230,
      failureCount: 20,
      successRate: 98.4,
      avgExecutionTime: "2.3 minutes",
      dataProcessed: "156.8 GB",
      lastExecution: "2025-08-21 11:45:00",
      status: "healthy",
      trend: "up",
      peakHour: "14:00",
      errorTypes: ["Connection timeout", "File not found"]
    },
    {
      id: 2,
      flowName: "Data Validation Pipeline",
      executionCount: 890,
      successCount: 838,
      failureCount: 52,
      successRate: 94.2,
      avgExecutionTime: "4.1 minutes",
      dataProcessed: "98.3 GB",
      lastExecution: "2025-08-21 11:30:00",
      status: "warning",
      trend: "down",
      peakHour: "16:00",
      errorTypes: ["Validation failed", "Memory exceeded"]
    },
    {
      id: 3,
      flowName: "Billing Data Processing",
      executionCount: 567,
      successCount: 562,
      failureCount: 5,
      successRate: 99.1,
      avgExecutionTime: "1.8 minutes",
      dataProcessed: "234.7 GB",
      lastExecution: "2025-08-21 11:15:00",
      status: "healthy",
      trend: "stable",
      peakHour: "18:00",
      errorTypes: ["Database timeout"]
    },
    {
      id: 4,
      flowName: "ASN.1 Decoder Pipeline",
      executionCount: 2134,
      successCount: 2098,
      failureCount: 36,
      successRate: 98.3,
      avgExecutionTime: "45 seconds",
      dataProcessed: "89.2 GB",
      lastExecution: "2025-08-21 11:50:00",
      status: "healthy",
      trend: "up",
      peakHour: "15:00",
      errorTypes: ["Malformed packet", "Decoding error"]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-secondary text-secondary-foreground';
      case 'error': return 'bg-destructive text-destructive-foreground';
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
          <BarChart3 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Flow Reports</h1>
            <p className="text-muted-foreground">Comprehensive flow execution analytics and performance metrics</p>
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
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Flows</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalFlows}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Active Flows</p>
                <p className="text-2xl font-bold text-success">{summaryMetrics.activeFlows}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Total Executions</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalExecutions.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Success Rate</p>
                <p className="text-2xl font-bold text-success">{summaryMetrics.avgSuccessRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-info" />
              <div>
                <p className="text-sm text-muted-foreground">Data Processed</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.totalDataProcessed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Time</p>
                <p className="text-2xl font-bold text-foreground">{summaryMetrics.avgExecutionTime}</p>
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
              <SelectValue placeholder="Flow Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Flows</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
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
          <CardTitle>Flow Performance Analysis</CardTitle>
          <CardDescription>Detailed execution statistics and performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Avg Time</TableHead>
                <TableHead>Data Processed</TableHead>
                <TableHead>Peak Hour</TableHead>
                <TableHead>Last Execution</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id} className="hover:bg-muted/50">
                  <TableCell className="font-medium">{report.flowName}</TableCell>
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
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${report.successRate >= 98 ? 'text-success' : report.successRate >= 95 ? 'text-warning' : 'text-destructive'}`}>
                        {report.successRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{report.avgExecutionTime}</TableCell>
                  <TableCell className="font-mono text-sm">{report.dataProcessed}</TableCell>
                  <TableCell>{report.peakHour}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.lastExecution}</TableCell>
                  <TableCell>{getTrendIcon(report.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Common Error Types</CardTitle>
          <CardDescription>Analysis of recurring issues across flows</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{report.flowName}</p>
                  <p className="text-sm text-muted-foreground">
                    {report.failureCount} failures out of {report.executionCount} executions
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    {report.errorTypes.map((error, index) => (
                      <Badge key={index} variant="outline" className="mr-1 text-xs">
                        {error}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}