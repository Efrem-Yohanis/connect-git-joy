import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Clock, CheckCircle, XCircle, Filter, Calendar, Search, Download, Server, Activity } from "lucide-react";

export function NodeAlertPage() {
  const nodeInfo = {
    name: "RNLT_RAFM_SFTP_DISTR",
    type: "DISTRIBUTOR",
    status: "RUNNING",
    uptime: "about 1 month",
    lastStart: "28.07.2025 at 15:58",
    lastChanged: "04.06.2025 at 13:04",
    host: "bp-nm-app01-vip.safaricomet.net",
    configuration: "EL_CFG_FTP_DISTRIBUTOR v2.1.0",
    application: "EL_APP_FTP_DISTRIBUTOR v2.1.7",
    libraries: "EL_LIB_SFTP 1.2.5",
    version: "04.06.2025 (revision 19)"
  };

  const streams = [
    {
      id: 1,
      name: "NOKIA_NCC_CDR_ASN1_FDC",
      status: "VALID",
      files: 1297,
      size: "42.56 MB",
      lastProcessed: "21.08.2025 at 16:14"
    },
    {
      id: 2,
      name: "BACKUP_STREAM_FDC",
      status: "VALID",
      files: 834,
      size: "28.13 MB",
      lastProcessed: "21.08.2025 at 16:12"
    }
  ];

  const alerts = [
    {
      id: 1,
      code: "FTP005",
      message: "Unable to delete file CDR_20250821_162130.gz - SFTP error: No such file",
      nodeName: "RNLT_RAFM_SFTP_DISTR",
      nodeVersion: "v2.1.7",
      host: "bp-nm-app01-vip.safaricomet.net",
      severity: "high",
      timestamp: "a few seconds ago 21.08.2025 at 16:21",
      status: "active"
    },
    {
      id: 2,
      code: "MEM001",
      message: "Memory usage exceeded 80% threshold (current: 85%)",
      nodeName: "Data Validator",
      nodeVersion: "v2.1.0",
      host: "bp-nm-app02-vip.safaricomet.net",
      severity: "medium",
      timestamp: "2 minutes ago 21.08.2025 at 16:19",
      status: "acknowledged"
    },
    {
      id: 3,
      code: "PERF001",
      message: "Processing time increased by 25% compared to baseline",
      nodeName: "ASN.1 Decoder",
      nodeVersion: "v1.0.5",
      host: "bp-nm-app03-vip.safaricomet.net",
      severity: "low",
      timestamp: "5 minutes ago 21.08.2025 at 16:16",
      status: "monitoring"
    },
    {
      id: 4,
      code: "FTP005",
      message: "Connection timeout after 30 seconds retry attempt",
      nodeName: "RNLT_RAFM_SFTP_DISTR",
      nodeVersion: "v2.1.7",
      host: "bp-nm-app01-vip.safaricomet.net",
      severity: "high",
      timestamp: "1 minute ago 21.08.2025 at 16:20",
      status: "active"
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
      case 'monitoring': return <Bell className="h-4 w-4 text-primary" />;
      case 'resolved': return <CheckCircle className="h-4 w-4 text-success" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const totalAlerts = alerts.length;

  return (
    <main className="w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Server className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Node Detail & Alerts</h1>
            <p className="text-muted-foreground">Monitor node health, streams, and active alerts</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">View Diagnostic Files</Button>
          <Button variant="outline" size="sm">View Configuration</Button>
        </div>
      </div>

      {/* Node Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{nodeInfo.name}</CardTitle>
              <CardDescription className="text-lg">
                {nodeInfo.type} • {nodeInfo.status} • Uptime: {nodeInfo.uptime}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-success text-success-foreground">
                {nodeInfo.status}
              </Badge>
              {activeAlerts.length > 0 && (
                <Badge className="bg-destructive text-destructive-foreground">
                  {activeAlerts.length} Unacknowledged Errors
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Host:</span>
                <span className="font-mono">{nodeInfo.host}</span>
                <span className="text-muted-foreground">Node Type:</span>
                <span>{nodeInfo.type}</span>
                <span className="text-muted-foreground">Last Start:</span>
                <span>{nodeInfo.lastStart}</span>
                <span className="text-muted-foreground">Last Changed:</span>
                <span>{nodeInfo.lastChanged}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <span className="text-muted-foreground">Configuration:</span>
                <span className="font-mono">{nodeInfo.configuration}</span>
                <span className="text-muted-foreground">Application:</span>
                <span className="font-mono">{nodeInfo.application}</span>
                <span className="text-muted-foreground">Libraries:</span>
                <span className="font-mono">{nodeInfo.libraries}</span>
                <span className="text-muted-foreground">Version:</span>
                <span>{nodeInfo.version}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streams Section */}
      <Card>
        <CardHeader>
          <CardTitle>Monitored Streams</CardTitle>
          <CardDescription>Input links & outgoing connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {streams.map((stream) => (
              <div key={stream.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-success" />
                  <div>
                    <p className="font-medium">{stream.name}</p>
                    <p className="text-sm text-muted-foreground">Last processed: {stream.lastProcessed}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {stream.status}
                  </Badge>
                  <span className="text-muted-foreground">Files: {stream.files.toLocaleString()}</span>
                  <span className="text-muted-foreground">Size: {stream.size}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Alerts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Active Alerts ({activeAlerts.length})</CardTitle>
              <CardDescription>Unacknowledged alerts requiring attention</CardDescription>
            </div>
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
                <TableHead>Node</TableHead>
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
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{alert.nodeName}</p>
                      <p className="text-xs text-muted-foreground">{alert.nodeVersion}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{alert.host}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{alert.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {activeAlerts.length > 5 && (
            <div className="pt-4 text-center">
              <Button variant="outline">Show more alerts »</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}