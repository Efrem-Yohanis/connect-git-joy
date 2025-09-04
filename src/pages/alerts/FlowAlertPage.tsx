import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Clock, CheckCircle, XCircle, Filter, Calendar, Search, Download } from "lucide-react";

export function FlowAlertPage() {
  const alerts = [
    {
      id: 1,
      code: "FTP005",
      message: "Unable to delete file CDR_20250821_101530.gz - SFTP error: No such file",
      flowName: "RNLT_RAFM_SFTP_DISTR",
      subsystem: "SFC_ETH_NOKIA_NCC_CDR_UPGARDE_STREAM",
      host: "bp-nm-app01-vip.safaricomet.net",
      severity: "high",
      timestamp: "a few seconds ago 21.08.2025 at 16:21",
      status: "active"
    },
    {
      id: 2,
      code: "VAL001",
      message: "Data validation failed for 12 records in batch processing",
      flowName: "Data Validation Pipeline",
      subsystem: "VALIDATION_ENGINE",
      host: "bp-nm-app02-vip.safaricomet.net",
      severity: "medium",
      timestamp: "2 minutes ago 21.08.2025 at 16:19",
      status: "acknowledged"
    },
    {
      id: 3,
      code: "BIL003",
      message: "Processing completed successfully for 15,847 records",
      flowName: "Billing Data Processing",
      subsystem: "BILLING_PROCESSOR",
      host: "bp-nm-app03-vip.safaricomet.net",
      severity: "low",
      timestamp: "5 minutes ago 21.08.2025 at 16:16",
      status: "resolved"
    },
    {
      id: 4,
      code: "FTP005",
      message: "Connection timeout after 30 seconds retry attempt",
      flowName: "RNLT_RAFM_SFTP_DISTR",
      subsystem: "SFC_ETH_NOKIA_NCC_CDR_UPGARDE_STREAM",
      host: "bp-nm-app01-vip.safaricomet.net",
      severity: "high",
      timestamp: "1 minute ago 21.08.2025 at 16:20",
      status: "active"
    },
    {
      id: 5,
      code: "ASN001",
      message: "ASN.1 decoding completed with warnings for malformed packets",
      flowName: "ASN.1 Decoder Pipeline",
      subsystem: "ASN1_DECODER",
      host: "bp-nm-app04-vip.safaricomet.net",
      severity: "medium",
      timestamp: "3 minutes ago 21.08.2025 at 16:18",
      status: "monitoring"
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-secondary text-secondary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'acknowledged': return <Clock className="h-4 w-4 text-secondary" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const totalAlerts = alerts.length;

  return (
    <main className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Flow Alerts</h1>
            <p className="text-muted-foreground">Monitor flow execution alerts and issues</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-2xl font-bold text-destructive">{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Total Alerts</p>
                <p className="text-2xl font-bold text-foreground">{totalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold text-foreground">{alerts.filter(a => a.status === 'acknowledged').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-success">{alerts.filter(a => a.status === 'resolved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Alerts</TabsTrigger>
            <TabsTrigger value="all">All Alerts</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input type="date" className="w-auto" placeholder="From" />
              <Input type="date" className="w-auto" placeholder="To" />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-10 w-64" placeholder="Search alerts..." />
            </div>
          </div>
        </div>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Active Alerts ({activeAlerts.length})</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Acknowledge Selected</Button>
                  <Button variant="outline" size="sm">Acknowledge All</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" className="rounded" />
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Flow</TableHead>
                    <TableHead>Subsystem</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeAlerts.map((alert) => (
                    <TableRow key={alert.id} className="hover:bg-muted/50">
                      <TableCell>
                        <input type="checkbox" className="rounded" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge className={getSeverityColor(alert.severity)} variant="outline">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{alert.code}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={alert.message}>
                          {alert.message}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alert.flowName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.subsystem}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.host}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Alerts ({totalAlerts})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Flow</TableHead>
                    <TableHead>Subsystem</TableHead>
                    <TableHead>Host</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(alert.status)}
                          <Badge className={getSeverityColor(alert.severity)} variant="outline">
                            {alert.severity.toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">{alert.code}</TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate" title={alert.message}>
                          {alert.message}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{alert.flowName}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.subsystem}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.host}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{alert.timestamp}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}