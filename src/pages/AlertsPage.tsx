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
import { AlertTriangle, Clock, CheckCircle } from "lucide-react";

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
    <div className="p-6 space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Acknowledged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Resolved Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">1</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">4</div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flow">Flow Alerts</TabsTrigger>
              <TabsTrigger value="node">Node Alerts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="flow" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Flow Name</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockFlowAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <span className="capitalize">{alert.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alert.flowName}</TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{alert.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {alert.status === "active" && (
                            <Button size="sm" variant="outline">
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="node" className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Node Name</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockNodeAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <span className="capitalize">{alert.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alert.nodeName}</TableCell>
                      <TableCell>{getSeverityBadge(alert.severity)}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{alert.timestamp}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {alert.status === "active" && (
                            <Button size="sm" variant="outline">
                              Acknowledge
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
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