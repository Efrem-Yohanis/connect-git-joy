import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Download, 
  Play, 
  Square, 
  AlertTriangle,
  Activity,
  Zap,
  Database,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Settings,
  Eye,
  MoreHorizontal
} from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data combining all streams from different mediation types
const allStreams = [
  {
    id: "charging-001",
    name: "CHARGING_GATEWAY_MAIN_STREAM",
    runningStatus: "RUNNING",
    lastUpdatedBy: "admin",
    lastCreatedBy: "system",
    throughput: "2.8K/sec",
    errors: 156,
    warnings: 23,
    mediationType: "Charging Gateway"
  },
  {
    id: "charging-002", 
    name: "BILLING_EVENTS_PROCESSOR_STREAM",
    runningStatus: "RUNNING",
    lastUpdatedBy: "john.doe",
    lastCreatedBy: "admin",
    throughput: "1.9K/sec",
    errors: 8,
    warnings: 45,
    mediationType: "Charging Gateway"
  },
  {
    id: "charging-003",
    name: "PAYMENT_VALIDATION_STREAM",
    runningStatus: "STOPPED",
    lastUpdatedBy: "jane.smith",
    lastCreatedBy: "system",
    throughput: "0/sec",
    errors: 0,
    warnings: 2,
    mediationType: "Charging Gateway"
  },
  {
    id: "convergent-001",
    name: "CONVERGENT_BILLING_STREAM",
    runningStatus: "RUNNING",
    lastUpdatedBy: "admin",
    lastCreatedBy: "system",
    throughput: "3.2K/sec",
    errors: 12,
    warnings: 8,
    mediationType: "Convergent"
  },
  {
    id: "convergent-002",
    name: "DATA_AGGREGATION_STREAM",
    runningStatus: "PARTIAL",
    lastUpdatedBy: "bob.wilson",
    lastCreatedBy: "admin",
    throughput: "1.1K/sec",
    errors: 45,
    warnings: 15,
    mediationType: "Convergent"
  },
  {
    id: "ncc-001",
    name: "NCC_REGULATORY_STREAM",
    runningStatus: "RUNNING",
    lastUpdatedBy: "system",
    lastCreatedBy: "admin",
    throughput: "850/sec",
    errors: 3,
    warnings: 12,
    mediationType: "NCC"
  },
  {
    id: "ncc-002",
    name: "COMPLIANCE_MONITORING_STREAM",
    runningStatus: "STOPPED",
    lastUpdatedBy: "alice.brown",
    lastCreatedBy: "system",
    throughput: "0/sec",
    errors: 0,
    warnings: 1,
    mediationType: "NCC"
  }
];

export function StreamsPage() {
  const navigate = useNavigate();
  const [streams, setStreams] = useState(allStreams);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [mediationFilter, setMediationFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  // Filter streams based on search and filters
  const filteredStreams = streams.filter(stream => {
    const matchesSearch = stream.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stream.mediationType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || stream.runningStatus === statusFilter;
    const matchesMediation = mediationFilter === "all" || stream.mediationType === mediationFilter;
    
    return matchesSearch && matchesStatus && matchesMediation;
  });

  // Pagination
  const totalPages = Math.ceil(filteredStreams.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedStreams = filteredStreams.slice(startIndex, startIndex + itemsPerPage);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
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

  const getMediationTypeBadge = (type: string) => {
    const colors = {
      "Charging Gateway": "bg-success/10 text-success border-success/20",
      "Convergent": "bg-info/10 text-info border-info/20", 
      "NCC": "bg-warning/10 text-warning border-warning/20"
    };
    
    return (
      <Badge variant="outline" className={colors[type as keyof typeof colors] || "bg-muted/10 text-muted-foreground"}>
        {type}
      </Badge>
    );
  };

  // Summary stats
  const runningStreams = filteredStreams.filter(s => s.runningStatus === "RUNNING").length;
  const stoppedStreams = filteredStreams.filter(s => s.runningStatus === "STOPPED").length;
  const partialStreams = filteredStreams.filter(s => s.runningStatus === "PARTIAL").length;
  const totalErrors = filteredStreams.reduce((sum, s) => sum + s.errors, 0);
  const totalWarnings = filteredStreams.reduce((sum, s) => sum + s.warnings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
      {/* Header Section */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="p-6">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/20">
                <Database className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Stream Management</h1>
                <p className="text-muted-foreground">Monitor and manage data processing streams across all mediation systems</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Dashboard Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="border-green-200/50 bg-gradient-to-br from-green-50/50 to-green-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Running Streams</CardTitle>
                <Play className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{runningStreams}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={(runningStreams / filteredStreams.length) * 100} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground">{Math.round((runningStreams / filteredStreams.length) * 100)}%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Active streams</div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/50 to-red-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Stopped Streams</CardTitle>
                <Square className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{stoppedStreams}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={(stoppedStreams / filteredStreams.length) * 100} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground">{Math.round((stoppedStreams / filteredStreams.length) * 100)}%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Inactive streams</div>
            </CardContent>
          </Card>
          
          <Card className="border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-orange-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Partial Streams</CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{partialStreams}</div>
              <div className="flex items-center gap-2 mt-2">
                <Progress value={(partialStreams / filteredStreams.length) * 100} className="flex-1 h-1" />
                <span className="text-xs text-muted-foreground">{Math.round((partialStreams / filteredStreams.length) * 100)}%</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">Degraded performance</div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-purple-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Errors</CardTitle>
                <TrendingDown className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{totalErrors}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <Activity className="h-3 w-3" />
                <span>Last 24 hours</span>
              </div>
              <div className="text-xs text-muted-foreground">Error count</div>
            </CardContent>
          </Card>
          
          <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-blue-100/20">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Throughput</CardTitle>
                <Zap className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">2.1K</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span>+8% from last hour</span>
              </div>
              <div className="text-xs text-muted-foreground">records/sec</div>
            </CardContent>
          </Card>
        </div>

        {/* Stream Management Panel */}
        <Card className="shadow-lg border-0 bg-background/60 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-background to-muted/20">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <CardTitle className="text-xl">Stream Processing Console</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">Real-time stream monitoring and management</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {/* Advanced Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search streams by name, type, or throughput..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="RUNNING">Running</SelectItem>
                    <SelectItem value="PARTIAL">Partial</SelectItem>
                    <SelectItem value="STOPPED">Stopped</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={mediationFilter} onValueChange={setMediationFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Mediation Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Charging Gateway">Charging Gateway</SelectItem>
                    <SelectItem value="Convergent">Convergent</SelectItem>
                    <SelectItem value="NCC">NCC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="mb-6" />
        
            {/* Enhanced Streams Table */}
            <div className="rounded-lg border bg-gradient-to-br from-muted/20 to-muted/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gradient-to-r from-muted/40 to-muted/30 border-b border-border">
                    <tr>
                      <th className="text-left font-semibold text-foreground px-6 py-4">Stream Name</th>
                      <th className="text-left font-semibold text-foreground px-6 py-4">Status</th>
                      <th className="text-left font-semibold text-foreground px-6 py-4">Performance</th>
                      <th className="text-left font-semibold text-foreground px-6 py-4">Health</th>
                      <th className="text-left font-semibold text-foreground px-6 py-4">Last Updated</th>
                      <th className="text-left font-semibold text-foreground px-6 py-4">Mediation Type</th>
                      <th className="text-center font-semibold text-foreground px-6 py-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {paginatedStreams.map((stream, index) => (
                      <tr 
                        key={stream.id}
                        className={`hover:bg-muted/30 transition-all duration-200 cursor-pointer animate-fade-in ${
                          index % 2 === 0 ? 'bg-background/50' : 'bg-muted/10'
                        }`}
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => navigate(`/streams/${stream.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground text-base">{stream.name}</span>
                            <span className="text-xs text-muted-foreground">ID: {stream.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {getStatusBadge(stream.runningStatus)}
                            {stream.runningStatus === "RUNNING" && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <Zap className="h-3 w-3 text-blue-500" />
                              <span className="font-semibold text-foreground">{stream.throughput}</span>
                            </div>
                            <div className="w-24">
                              <Progress 
                                value={stream.runningStatus === "RUNNING" ? 75 : stream.runningStatus === "PARTIAL" ? 45 : 0} 
                                className="h-1"
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-red-500" />
                              <span className={`font-medium text-sm ${stream.errors > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                                {stream.errors}
                              </span>
                            </div>
                            <span className="text-muted-foreground text-xs">/</span>
                            <div className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span className={`font-medium text-sm ${stream.warnings > 0 ? 'text-orange-600' : 'text-muted-foreground'}`}>
                                {stream.warnings}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm text-muted-foreground">By: {stream.lastUpdatedBy}</span>
                            <span className="text-xs text-muted-foreground">Created: {stream.lastCreatedBy}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getMediationTypeBadge(stream.mediationType)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/streams/${stream.id}`);
                              }}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-muted"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Settings className="h-3 w-3 mr-2" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Play className="h-3 w-3 mr-2" />
                                  Start/Stop
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <BarChart3 className="h-3 w-3 mr-2" />
                                  View Metrics
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Enhanced Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-border/50 bg-gradient-to-r from-muted/20 to-muted/10">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">Show</span>
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger className="w-20 h-8 border-muted">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-sm text-muted-foreground">
                    of <span className="font-medium text-foreground">{filteredStreams.length}</span> streams
                  </span>
                </div>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        className={`${currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} transition-colors`}
                      />
                    </PaginationItem>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink 
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                            className="cursor-pointer hover:bg-muted transition-colors"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        className={`${currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-muted"} transition-colors`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}