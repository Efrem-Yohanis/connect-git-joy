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
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter, 
  Download, 
  RefreshCw,
  Bell,
  Shield,
  TrendingUp,
  AlertCircle,
  Activity
} from "lucide-react";

// Mock data for alerts
const mockFlowAlerts = [
  {
    id: "fa-001",
    flowName: "Convergent Data Processing",
    severity: "high",
    message: "Flow execution failed after 3 retries",
    timestamp: "2024-01-15 14:30:22",
    status: "active"
  },
  {
    id: "fa-002", 
    flowName: "Charging Flow Pipeline",
    severity: "medium",
    message: "Performance degradation detected",
    timestamp: "2024-01-15 13:45:10",
    status: "acknowledged"
  },
];

const mockNodeAlerts = [
  {
    id: "na-001",
    nodeName: "Data Validator Node",
    severity: "high",
    message: "Validation failure threshold exceeded",
    timestamp: "2024-01-15 15:10:05",
    status: "active"
  },
  {
    id: "na-002",
    nodeName: "Enrichment Node",
    severity: "low",
    message: "Memory usage approaching limit",
    timestamp: "2024-01-15 12:20:33",
    status: "resolved"
  },
];

export function AlertsPage() {
  const [activeTab, setActiveTab] = useState("flow");
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium</Badge>;
      case "low":
        return <Badge className="bg-info text-info-foreground">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "acknowledged":
        return <Clock className="h-4 w-4 text-warning" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-success" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-200/20">
                <Shield className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Alert Management</h1>
                <p className="text-muted-foreground">Monitor and manage system alerts across flows and nodes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Alert Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/50 to-red-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Alerts</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">2</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>+1 from yesterday</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-orange-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">1</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Activity className="h-3 w-3" />
                <span>Pending resolution</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-green-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">1</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3" />
                <span>98% resolution rate</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-blue-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
                <Bell className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">4</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Activity className="h-3 w-3" />
                <span>Last 24 hours</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert Management Panel */}
        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Alert Management Console</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Real-time monitoring and alert resolution</p>
              </div>
              <div className="flex items-center gap-2">
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
                  placeholder="Search alerts by name, message, or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Select value={severityFilter} onValueChange={setSeverityFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="acknowledged">Acknowledged</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="mb-6" />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="flow" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600">
                  Flow Alerts
                </TabsTrigger>
                <TabsTrigger value="node" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600">
                  Node Alerts
                </TabsTrigger>
              </TabsList>
            
              <TabsContent value="flow" className="mt-0">
                <div className="rounded-lg border bg-gradient-to-br from-blue-50/30 to-blue-100/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-blue-200/50 bg-blue-50/50">
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Flow Name</TableHead>
                        <TableHead className="font-semibold">Severity</TableHead>
                        <TableHead className="font-semibold">Message</TableHead>
                        <TableHead className="font-semibold">Timestamp</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockFlowAlerts.map((alert) => (
                        <TableRow key={alert.id} className="hover:bg-blue-50/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(alert.status)}
                              <span className="capitalize font-medium">{alert.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">{alert.flowName}</TableCell>
                          <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate" title={alert.message}>
                              {alert.message}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{alert.timestamp}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              {alert.status === "active" && (
                                <Button size="sm" variant="outline" className="bg-orange-50 border-orange-200 hover:bg-orange-100">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Acknowledge
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="bg-blue-50 border-blue-200 hover:bg-blue-100">
                                View Details
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            
              <TabsContent value="node" className="mt-0">
                <div className="rounded-lg border bg-gradient-to-br from-purple-50/30 to-purple-100/10">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-purple-200/50 bg-purple-50/50">
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="font-semibold">Node Name</TableHead>
                        <TableHead className="font-semibold">Severity</TableHead>
                        <TableHead className="font-semibold">Message</TableHead>
                        <TableHead className="font-semibold">Timestamp</TableHead>
                        <TableHead className="font-semibold text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockNodeAlerts.map((alert) => (
                        <TableRow key={alert.id} className="hover:bg-purple-50/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(alert.status)}
                              <span className="capitalize font-medium">{alert.status}</span>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold text-foreground">{alert.nodeName}</TableCell>
                          <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                          <TableCell className="max-w-md">
                            <div className="truncate" title={alert.message}>
                              {alert.message}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{alert.timestamp}</TableCell>
                          <TableCell>
                            <div className="flex justify-center gap-2">
                              {alert.status === "active" && (
                                <Button size="sm" variant="outline" className="bg-orange-50 border-orange-200 hover:bg-orange-100">
                                  <Clock className="h-3 w-3 mr-1" />
                                  Acknowledge
                                </Button>
                              )}
                              <Button size="sm" variant="outline" className="bg-purple-50 border-purple-200 hover:bg-purple-100">
                                View Details
                              </Button>
                            </div>
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