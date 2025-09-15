import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Clock, 
  CheckCircle, 
  Search, 
  Filter,
  AlertCircle,
  Info,
  X
} from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: string;
  node: string;
  acknowledged: boolean;
}

interface LogEntry {
  id: string;
  type: "cleanup" | "error" | "retry" | "info";
  message: string;
  timestamp: string;
  node?: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "error",
    message: "Connection timeout to database server",
    timestamp: "2024-01-15 14:32:15",
    node: "Validation BLN",
    acknowledged: false
  },
  {
    id: "2",
    type: "warning", 
    message: "High memory usage detected (85%)",
    timestamp: "2024-01-15 14:28:42",
    node: "ASCII Decoder",
    acknowledged: false
  },
  {
    id: "3",
    type: "info",
    message: "Batch processing completed successfully",
    timestamp: "2024-01-15 14:25:18",
    node: "SFTP Collector",
    acknowledged: true
  }
];

const mockLogs: LogEntry[] = [
  {
    id: "1",
    type: "cleanup",
    message: "Cleaned up 1,250 temporary files from /tmp/processing",
    timestamp: "2024-01-15 14:35:00",
    node: "System"
  },
  {
    id: "2",
    type: "error",
    message: "Failed to process batch 15420 - retrying in 30 seconds",
    timestamp: "2024-01-15 14:32:15",
    node: "Validation BLN"
  },
  {
    id: "3",
    type: "retry",
    message: "Retry attempt 2/3 for batch 15420",
    timestamp: "2024-01-15 14:32:45",
    node: "Validation BLN"
  },
  {
    id: "4",
    type: "info",
    message: "Successfully processed 15,420 records in batch",
    timestamp: "2024-01-15 14:30:00",
    node: "SFTP Collector"
  }
];

export function AlertsLogsPanel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([]);
  const [alerts, setAlerts] = useState(mockAlerts);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error": return <AlertCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      case "info": return <Info className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "error": return "bg-destructive/10 text-destructive border-destructive/20";
      case "warning": return "bg-warning/10 text-warning border-warning/20";
      case "info": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case "cleanup": return <CheckCircle className="h-4 w-4 text-success" />;
      case "error": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "retry": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info": return <Info className="h-4 w-4 text-blue-600" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const acknowledgeAlert = (alertId: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ));
  };

  const acknowledgeAll = () => {
    setAlerts(alerts.map(alert => ({ ...alert, acknowledged: true })));
  };

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alerts & Logs
          </div>
          {unacknowledgedCount > 0 && (
            <Badge variant="destructive">
              {unacknowledgedCount} unacknowledged
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Active Alerts
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Log Timeline
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="alerts" className="mt-6 space-y-4">
            {/* Alert Controls */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search alerts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
              
              {unacknowledgedCount > 0 && (
                <Button onClick={acknowledgeAll} size="sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Acknowledge All
                </Button>
              )}
            </div>

            {/* Alerts List */}
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border ${
                    alert.acknowledged ? "opacity-60" : ""
                  } ${alert.acknowledged ? "bg-muted/30" : "bg-card"}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <Badge className={getAlertColor(alert.type)}>
                        {getAlertIcon(alert.type)}
                        <span className="ml-1 capitalize">{alert.type}</span>
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {alert.timestamp}
                          </span>
                          <span>Node: {alert.node}</span>
                        </div>
                      </div>
                    </div>
                    
                    {!alert.acknowledged && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Acknowledge
                      </Button>
                    )}
                    
                    {alert.acknowledged && (
                      <Badge variant="outline" className="text-success border-success/20">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Acknowledged
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="logs" className="mt-6 space-y-4">
            {/* Log Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-10"
              />
            </div>

            {/* Log Timeline */}
            <div className="space-y-3">
              {mockLogs.map((log, index) => (
                <div key={log.id} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {getLogIcon(log.type)}
                    {index < mockLogs.length - 1 && (
                      <div className="w-0.5 h-8 bg-border mt-2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 pb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{log.timestamp}</span>
                      {log.node && (
                        <Badge variant="outline" className="text-xs">
                          {log.node}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{log.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}