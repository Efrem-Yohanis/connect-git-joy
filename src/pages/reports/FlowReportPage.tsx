import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GitCommit } from "lucide-react";
import { useEffect, useState } from "react";
import { gitService } from "@/services/gitService";


export function FlowReportPage() {
  const [gitInfo, setGitInfo] = useState<any>(null);

  useEffect(() => {
    const fetchGitInfo = async () => {
      try {
        const info = await gitService.getLatestCommit();
        setGitInfo(info);
        console.log('Latest Git Commit Info:', {
          hash: info.lastCommit.hash,
          message: info.lastCommit.message,
          author: info.lastCommit.author,
          date: new Date(info.lastCommit.date).toLocaleString(),
          branch: info.lastCommit.branch,
          repository: info.repository.name
        });
      } catch (error) {
        console.error('Failed to fetch git info:', error);
      }
    };
    
    fetchGitInfo();
  }, []);

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


  return (
    <main className="min-h-screen bg-background p-8 space-y-6">
      {/* Git Commit Info */}
      {gitInfo && (
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <GitCommit className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Latest Commit:</span>
                <span className="font-mono text-sm text-foreground">{gitInfo.lastCommit.hash}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium text-foreground">{gitInfo.lastCommit.message}</span>
                <span className="text-sm text-muted-foreground">by {gitInfo.lastCommit.author}</span>
                <span className="text-sm text-muted-foreground">{new Date(gitInfo.lastCommit.date).toLocaleDateString()}</span>
                <Badge variant="outline" className="text-xs">
                  {gitInfo.lastCommit.branch}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simple Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Flows</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.activeFlows}</p>
            <p className="text-xs text-muted-foreground">of {summaryMetrics.totalFlows} Total</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Success Rate</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.avgSuccessRate}%</p>
            <p className="text-xs text-muted-foreground">Average Performance</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Executions</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.totalExecutions.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Data Volume</p>
            <p className="text-2xl font-medium text-foreground">{summaryMetrics.totalDataProcessed}</p>
            <p className="text-xs text-muted-foreground">{summaryMetrics.avgExecutionTime} Avg Time</p>
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
                <Input type="date" className="w-auto" placeholder="From" />
                <Input type="date" className="w-auto" placeholder="To" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline">Export Data</Button>
              <Button>Advanced Filters</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simple Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Flow Performance Analytics</CardTitle>
          <CardDescription>Execution metrics and performance insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Flow Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Executions</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Average Time</TableHead>
                <TableHead>Data Processed</TableHead>
                <TableHead>Peak Hour</TableHead>
                <TableHead>Last Execution</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{report.flowName}</div>
                      <div className="text-sm text-muted-foreground">Flow execution pipeline</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{report.executionCount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {report.successCount} success, {report.failureCount} failed
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{report.successRate}%</span>
                  </TableCell>
                  <TableCell className="font-medium">{report.avgExecutionTime}</TableCell>
                  <TableCell className="font-mono text-sm">{report.dataProcessed}</TableCell>
                  <TableCell className="font-medium">{report.peakHour}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{report.lastExecution}</TableCell>
                  <TableCell className="font-medium">{report.trend}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Simple Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Error Analysis</CardTitle>
          <CardDescription>Error tracking and resolution patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="p-4 border rounded">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="font-medium">{report.flowName}</p>
                    <p className="text-sm text-muted-foreground">
                      {report.failureCount} failures out of {report.executionCount} total executions
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-muted rounded-full h-2 max-w-xs">
                        <div 
                          className="h-2 rounded-full bg-foreground" 
                          style={{ width: `${report.successRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{report.successRate}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Error Types</div>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {report.errorTypes.map((error, errorIndex) => (
                        <Badge key={errorIndex} variant="outline" className="text-xs">
                          {error}
                        </Badge>
                      ))}
                    </div>
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