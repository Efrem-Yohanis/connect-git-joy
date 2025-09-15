import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Monitor,
  RefreshCw,
  Bell,
  Play,
  Square,
  AlertCircle,
  Info,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const chargingStreams = [
  {
    id: "charging-001",
    name: "CHARGING_GATEWAY_MAIN_STREAM",
    errors: 156,
    warnings: 23,
    instances: 1,
    status: "RUNNING",
    uptime: "12d 6h 15m",
    lastActivity: "2 seconds ago",
    throughput: "2.8K/sec"
  },
  {
    id: "charging-002", 
    name: "BILLING_EVENTS_PROCESSOR_STREAM",
    errors: 8,
    warnings: 45,
    instances: 1,
    status: "RUNNING",
    uptime: "8d 22h 40m",
    lastActivity: "1 second ago",
    throughput: "1.9K/sec"
  },
  {
    id: "charging-003",
    name: "PAYMENT_VALIDATION_STREAM",
    errors: 0,
    warnings: 2,
    instances: 1,
    status: "STOPPED",
    uptime: "0h",
    lastActivity: "2 hours ago",
    throughput: "0/sec"
  }
];

export function ChargingMediationPage() {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RUNNING": return "text-success";
      case "PARTIAL": return "text-warning";
      case "STOPPED": return "text-muted-foreground";
      default: return "text-muted-foreground";
    }
  };

  const getStatusBadge = (status: string) => {
    const variant = status === "RUNNING" ? "default" :
                   status === "PARTIAL" ? "secondary" : 
                   "destructive";
    
    return (
      <Badge variant={variant} className="text-xs font-medium">
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="space-y-6 p-6">
        {/* Dashboard Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 rounded-2xl" />
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                      Charging Gateway Mediation
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Real-time monitoring of charging and billing streams
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="h-9"
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <div className="flex flex-col items-end gap-1 ml-4">
                  <div className="text-xs text-muted-foreground">
                    {currentTime.toLocaleDateString()}
                  </div>
                  <div className="text-sm font-bold text-primary">
                    {currentTime.toLocaleTimeString('en-US', { hour12: false })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-6">
          <Card className="bg-success/5 border-success/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Play className="h-5 w-5 text-success" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-success">
                    {chargingStreams.filter(stream => stream.status === "RUNNING").length}
                  </div>
                  <div className="text-sm text-muted-foreground">All Running Streams</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-destructive/5 border-destructive/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Square className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    {chargingStreams.filter(stream => stream.status === "STOPPED").length}
                  </div>
                  <div className="text-sm text-muted-foreground">All Stopped Streams</div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5 border-primary/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Monitor className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {chargingStreams.length}
                  </div>
                  <div className="text-sm text-muted-foreground">All Streams</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5 border-destructive/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-destructive">
                    164
                  </div>
                  <div className="text-sm text-muted-foreground">Total Errors</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warning/5 border-warning/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-warning">
                    70
                  </div>
                  <div className="text-sm text-muted-foreground">Total Warnings</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-info/5 border-info/20 shadow-subtle">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-info/10 rounded-lg">
                  <Info className="h-5 w-5 text-info" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-info">
                    18
                  </div>
                  <div className="text-sm text-muted-foreground">Info Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Streams Table */}
        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-subtle">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Streams</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="status-filter" className="text-sm font-medium text-muted-foreground">
                    Filter by:
                  </label>
                  <select 
                    id="status-filter"
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    defaultValue="all"
                  >
                    <option value="all">All Status</option>
                    <option value="RUNNING">Running</option>
                    <option value="STOPPED">Stopped</option>
                    <option value="PARTIAL">Partial</option>
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search flows..."
                    className="h-9 w-full sm:w-64 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-hidden rounded-lg border border-border">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b border-border sticky top-0 z-10">
                    <tr>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Stream Name
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Errors / Warnings  
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Instances
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Status
                      </th>
                      <th className="text-left font-medium text-muted-foreground px-4 py-3">
                        Throughput
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {chargingStreams.map((stream) => (
                      <tr 
                        key={stream.id}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => navigate(`/streams/${stream.id}`)}
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {stream.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${stream.errors > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                              {stream.errors.toLocaleString()}
                            </span>
                            <span className="text-muted-foreground">/</span>
                            <span className={`font-medium ${stream.warnings > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                              {stream.warnings}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {stream.instances}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(stream.status)}
                        </td>
                        <td className="px-4 py-3 font-medium">
                          {stream.throughput}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
              <div className="text-sm text-muted-foreground">
                Showing 1 to {chargingStreams.length} of {chargingStreams.length} flows
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}