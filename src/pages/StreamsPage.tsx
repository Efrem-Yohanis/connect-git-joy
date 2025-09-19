import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RefreshCw, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
    <div className="p-6 space-y-6">

      {/* Filters and Search */}
      <Card className="professional-card">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <CardTitle className="text-lg font-semibold text-foreground">
              Total stream
            </CardTitle>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search streams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full sm:w-64"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
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
                <SelectTrigger className="w-full sm:w-48">
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
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Name</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Running Status</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Last Updated By</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Last Created By</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Throughput</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Errors / Warnings</th>
                  <th className="text-left font-medium text-muted-foreground px-4 py-3">Mediation Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedStreams.map((stream) => (
                  <tr 
                    key={stream.id}
                    className="hover:bg-muted/30 transition-colors cursor-pointer"
                    onClick={() => navigate(`/streams/${stream.id}`)}
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {stream.name}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(stream.runningStatus)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {stream.lastUpdatedBy}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {stream.lastCreatedBy}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {stream.throughput}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium ${stream.errors > 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {stream.errors}
                        </span>
                        <span className="text-muted-foreground">/</span>
                        <span className={`font-medium ${stream.warnings > 0 ? 'text-warning' : 'text-muted-foreground'}`}>
                          {stream.warnings}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {getMediationTypeBadge(stream.mediationType)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Show</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 h-8">
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
                of {filteredStreams.length} entries
              </span>
            </div>
            
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <PaginationItem key={page}>
                      <PaginationLink 
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}