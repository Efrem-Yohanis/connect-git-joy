import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


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


  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const totalAlerts = alerts.length;

  return (
    <main className="w-full p-6 space-y-8 bg-background">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Flow Alerts & Monitoring
          </h1>
          <p className="text-muted-foreground text-lg">Real-time monitoring of flow execution streams</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button size="sm">
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                <p className="text-3xl font-bold text-destructive">{activeAlerts.length}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last 24h</p>
                <p className="text-sm font-semibold text-destructive">+{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                <p className="text-3xl font-bold text-foreground">{totalAlerts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Acknowledged</p>
                <p className="text-3xl font-bold text-foreground">{alerts.filter(a => a.status === 'acknowledged').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-success">{alerts.filter(a => a.status === 'resolved').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card className="border border-border bg-card">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold text-foreground">Alert Management</h3>
              <Badge variant="outline" className="text-primary border-primary/20">
                Live Monitoring
              </Badge>
            </div>
            <div className="flex items-center gap-3">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="24h">
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Time Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
                <Input className="w-80" placeholder="Search flows, messages, or error codes..." />
            </div>
          </div>
          
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Active Alerts ({activeAlerts.length})
              </TabsTrigger>
              <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                All Alerts ({totalAlerts})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h4 className="text-xl font-semibold">Critical Alerts Requiring Attention</h4>
                  <Badge className="bg-destructive/20 text-destructive border-destructive/30">
                    {activeAlerts.length} Active
                  </Badge>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm" className="shadow-sm">
                    Mark Selected as Acknowledged
                  </Button>
                  <Button variant="default" size="sm" className="shadow-lg bg-gradient-to-r from-primary to-primary/90">
                    Acknowledge All Critical
                  </Button>
                </div>
              </div>
              
              <Card className="border">
                <CardHeader className="bg-muted/50">
                  <CardTitle>Active Alert Details</CardTitle>
                  <CardDescription>Real-time monitoring of flow execution issues</CardDescription>
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
                            <Badge className={getSeverityColor(alert.severity)} variant="outline">
                              {alert.severity.toUpperCase()}
                            </Badge>
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

            <TabsContent value="all" className="space-y-6">
              <Card className="border">
                <CardHeader className="bg-muted/50">
                  <CardTitle>Complete Alert History ({totalAlerts})</CardTitle>
                  <CardDescription>Comprehensive view of all system alerts and their resolution status</CardDescription>
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
                            <Badge className={getSeverityColor(alert.severity)} variant="outline">
                              {alert.severity.toUpperCase()}
                            </Badge>
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
        </CardContent>
      </Card>
    </main>
  );
}