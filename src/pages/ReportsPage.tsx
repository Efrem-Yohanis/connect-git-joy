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
import { Download, TrendingUp, TrendingDown } from "lucide-react";

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
    <div className="p-6 space-y-6">
      {/* Report Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Nodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">7</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Running Flows</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Throughput</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1.05K/min</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">99.2%</div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="node">Node Reports</TabsTrigger>
              <TabsTrigger value="flow">Flow Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="node" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Node Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Throughput</TableHead>
                    <TableHead>Error Rate</TableHead>
                    <TableHead>Uptime</TableHead>
                    <TableHead>Last Processed</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNodeReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.nodeName}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.throughput}</TableCell>
                      <TableCell>
                        <span className={parseFloat(report.errorRate) > 1 ? "text-destructive" : "text-success"}>
                          {report.errorRate}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={parseFloat(report.uptime) > 99 ? "text-success" : "text-warning"}>
                          {report.uptime}
                        </span>
                      </TableCell>
                      <TableCell>{report.lastProcessed}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(report.trend)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="flow" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flow Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total Nodes</TableHead>
                    <TableHead>Active Nodes</TableHead>
                    <TableHead>Completion Rate</TableHead>
                    <TableHead>Avg Processing Time</TableHead>
                    <TableHead>Last Execution</TableHead>
                    <TableHead>Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFlowReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.flowName}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>{report.totalNodes}</TableCell>
                      <TableCell>{report.activeNodes}</TableCell>
                      <TableCell>
                        <span className={parseFloat(report.completionRate) > 90 ? "text-success" : "text-warning"}>
                          {report.completionRate}
                        </span>
                      </TableCell>
                      <TableCell>{report.avgProcessingTime}</TableCell>
                      <TableCell>{report.lastExecution}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getTrendIcon(report.trend)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}