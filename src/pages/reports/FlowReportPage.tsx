import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, TrendingUp, TrendingDown, Activity, BarChart3, Clock, CheckCircle, XCircle, Filter, Calendar, Download, Shield, LineChart } from "lucide-react";

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
            Healthy
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-warning/10 text-warning border-warning/20 hover:bg-warning/20">
            <div className="w-2 h-2 bg-warning rounded-full mr-2" />
            Warning
          </Badge>
        );
      case 'error':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
            <div className="w-2 h-2 bg-destructive rounded-full mr-2 animate-pulse" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown
          </Badge>
        );
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
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
    <main className="min-h-screen bg-background p-8 space-y-8">
      {/* Professional Summary Metrics - Reduced to 4 key cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="metric-card hover-scale animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-primary/10">
              <Activity className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Flows</p>
              <p className="text-3xl font-bold text-foreground">{summaryMetrics.activeFlows}</p>
              <p className="text-xs text-muted-foreground">of {summaryMetrics.totalFlows} Total</p>
            </div>
          </div>
        </div>

        <div className="metric-card hover-scale animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-success/10">
              <BarChart3 className="h-7 w-7 text-success" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Success Rate</p>
              <p className="text-3xl font-bold text-success">{summaryMetrics.avgSuccessRate}%</p>
              <p className="text-xs text-muted-foreground">Avg Performance</p>
            </div>
          </div>
        </div>

        <div className="metric-card hover-scale animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-info/10">
              <TrendingUp className="h-7 w-7 text-info" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Executions</p>
              <p className="text-3xl font-bold text-foreground">{summaryMetrics.totalExecutions.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total Processed</p>
            </div>
          </div>
        </div>

        <div className="metric-card hover-scale animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center gap-4">
            <div className="p-4 bg-muted/10">
              <FileText className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data Volume</p>
              <p className="text-3xl font-bold text-foreground">{summaryMetrics.totalDataProcessed}</p>
              <p className="text-xs text-muted-foreground">{summaryMetrics.avgExecutionTime} Avg Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Filters Section */}
      <div className="professional-card p-8 animate-slide-up">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Select defaultValue="all">
              <SelectTrigger className="w-48 h-12 bg-background/80 border-border/60 transition-all duration-200">
                <SelectValue placeholder="Flow Status" />
              </SelectTrigger>
              <SelectContent className="border-border/60">
                <SelectItem value="all">All Flows</SelectItem>
                <SelectItem value="healthy">Healthy</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Input 
                type="date" 
                className="w-auto h-12 bg-background/80 border-border/60 transition-all duration-200" 
                placeholder="From" 
              />
              <Input 
                type="date" 
                className="w-auto h-12 bg-background/80 border-border/60 transition-all duration-200" 
                placeholder="To" 
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="lg" className="h-12 px-6 border-border/60 hover:border-primary/40">
              <Download className="h-5 w-5 mr-2" />
              Export Data
            </Button>
            <Button size="lg" className="h-12 px-6 bg-gradient-to-r from-primary to-primary/90">
              <Filter className="h-5 w-5 mr-2" />
              Advanced Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Professional Data Table */}
      <div className="professional-card overflow-hidden animate-scale-in">
        <div className="p-8 border-b border-border/40">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Flow Performance Analytics</h2>
              <p className="text-muted-foreground">Comprehensive execution metrics and performance insights</p>
            </div>
          </div>
        </div>
        <div className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 bg-muted/10 hover:bg-muted/10">
                <TableHead className="font-semibold text-foreground py-4 px-6">Flow Name</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Status</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Executions</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Success Rate</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Avg Time</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Data Processed</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Peak Hour</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Last Execution</TableHead>
                <TableHead className="font-semibold text-foreground py-4">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow 
                  key={report.id} 
                  className="border-border/30 hover:bg-muted/5 transition-all duration-200 surface-interactive"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground">{report.flowName}</div>
                      <div className="text-sm text-muted-foreground">Flow execution pipeline</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="py-4">
                    <div>
                      <p className="font-medium text-foreground">{report.executionCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.successCount} success, {report.failureCount} failed
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${report.successRate >= 98 ? 'text-success' : report.successRate >= 95 ? 'text-warning' : 'text-destructive'}`}>
                        {report.successRate}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-4 font-medium">{report.avgExecutionTime}</TableCell>
                  <TableCell className="py-4 font-mono text-sm font-medium">{report.dataProcessed}</TableCell>
                  <TableCell className="py-4 font-medium">{report.peakHour}</TableCell>
                  <TableCell className="py-4 text-sm text-muted-foreground">{report.lastExecution}</TableCell>
                  <TableCell className="py-4">{getTrendIcon(report.trend)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Professional Error Analysis */}
      <div className="professional-card p-8 animate-fade-in">
        <div className="flex items-center gap-4 mb-8">
          <div className="p-3 bg-warning/10">
            <Activity className="h-6 w-6 text-warning" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Error Analysis & Insights</h2>
            <p className="text-muted-foreground">Comprehensive error tracking and resolution patterns</p>
          </div>
        </div>
        <div className="grid gap-6">
          {reports.map((report, index) => (
            <div key={report.id} className="surface-interactive p-6 border border-border/40 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="font-semibold text-lg text-foreground">{report.flowName}</p>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-destructive">{report.failureCount}</span> failures out of{" "}
                    <span className="font-medium">{report.executionCount}</span> total executions
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-success to-success" 
                        style={{ width: `${report.successRate}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-success min-w-fit">{report.successRate}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right space-y-1">
                    <div className="text-xs text-muted-foreground">Error Types</div>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {report.errorTypes.map((error, errorIndex) => (
                        <Badge key={errorIndex} variant="outline" className="text-xs border-destructive/20 text-destructive bg-destructive/5">
                          {error}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}