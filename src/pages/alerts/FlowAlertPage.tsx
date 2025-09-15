import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Clock, CheckCircle, XCircle, Filter, Calendar, Search, Download, RefreshCw, Bell, Shield } from "lucide-react";

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
    <main className="w-full p-6 space-y-8">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Flow Alerts & Monitoring
            </h1>
            <p className="text-muted-foreground text-lg">Enterprise-grade flow execution monitoring and alert management system</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="shadow-sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto Refresh
          </Button>
          <Button variant="outline" size="sm" className="shadow-sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" className="shadow-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
            <Bell className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-destructive/5 to-destructive/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/20 rounded-lg">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Critical Alerts</p>
                  <p className="text-3xl font-bold text-destructive">{activeAlerts.length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Last 24h</p>
                <p className="text-sm font-semibold text-destructive">+{activeAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-primary/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/20 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Alerts</p>
                  <p className="text-3xl font-bold text-foreground">{totalAlerts}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">All time</p>
                <p className="text-sm font-semibold text-primary">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-secondary/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <Clock className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Acknowledged</p>
                  <p className="text-3xl font-bold text-foreground">{alerts.filter(a => a.status === 'acknowledged').length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Processing</p>
                <p className="text-sm font-semibold text-secondary-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-success/5 to-success/10 hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-3xl font-bold text-success">{alerts.filter(a => a.status === 'resolved').length}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Success rate</p>
                <p className="text-sm font-semibold text-success">98.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters and Controls */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-background to-muted/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">Alert Management</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
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
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-10 w-80" placeholder="Search flows, messages, or error codes..." />
              </div>
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
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Active Alert Details
                  </CardTitle>
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

            <TabsContent value="all" className="space-y-6">
              <Card className="border">
                <CardHeader className="bg-muted/50">
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Complete Alert History ({totalAlerts})
                  </CardTitle>
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
        </CardContent>
      </Card>
    </main>
  );
}