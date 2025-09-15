import { useState } from "react";
import { Eye, Grid, List, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export interface MediationFlow {
  id: string;
  name: string;
  status: "running" | "stopped" | "error";
  description: string;
  lastRun: string;
  processedRecords: number;
  errorRate: number;
}

interface MediationContentProps {
  flows: MediationFlow[];
  basePath: string;
}

export function MediationContent({ flows, basePath }: MediationContentProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const filteredFlows = flows.filter(flow => {
    const matchesSearch = flow.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || flow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredFlows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFlows = filteredFlows.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return (
          <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20">
            <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse" />
            Running
          </Badge>
        );
      case "stopped":
        return (
          <Badge className="bg-muted/40 text-muted-foreground border-muted/40">
            <div className="w-2 h-2 bg-muted-foreground rounded-full mr-2" />
            Stopped
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20">
            <div className="w-2 h-2 bg-destructive rounded-full mr-2 animate-pulse" />
            Error
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            Unknown
          </Badge>
        );
    }
  };

  const getErrorRateColor = (errorRate: number) => {
    if (errorRate < 0.05) return "text-success";
    if (errorRate < 0.10) return "text-warning";
    return "text-destructive";
  };

  return (
    <>
      {/* Enhanced Controls Section */}
      <div className="bg-card/50 backdrop-blur-xl border border-border/40 p-8">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] bg-background/70 border-border/60 focus:border-primary/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="15">15 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={(value) => {
                setStatusFilter(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[140px] bg-background/70 border-border/60 focus:border-primary/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="stopped">Stopped</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Search flows..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-80 bg-background/70 border-border/60 focus:border-primary/50 focus:bg-background transition-all duration-200"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex border border-border/60 bg-background/50 backdrop-blur-sm">
              <Button
                onClick={() => setViewMode("list")}
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className={`transition-all duration-300 ${
                  viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                }`}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setViewMode("grid")}
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className={`transition-all duration-300 ${
                  viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-primary/10"
                }`}
              >
                <Grid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === "list" ? (
        <div className="bg-card/50 backdrop-blur-xl border border-border/40 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/40 bg-muted/20 hover:bg-muted/20">
                <TableHead className="font-semibold text-foreground">Flow Name</TableHead>
                <TableHead className="font-semibold text-foreground">Status</TableHead>
                <TableHead className="font-semibold text-foreground">Last Execution</TableHead>
                <TableHead className="font-semibold text-foreground">Records Processed</TableHead>
                <TableHead className="font-semibold text-foreground">Error Rate</TableHead>
                <TableHead className="text-right font-semibold text-foreground">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFlows.map((flow, index) => (
                <TableRow 
                  key={flow.id} 
                  className="border-border/30 hover:bg-muted/10 transition-all duration-200 animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-semibold text-foreground">{flow.name}</div>
                      <div className="text-sm text-muted-foreground line-clamp-1">{flow.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(flow.status)}</TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground font-medium">{flow.lastRun}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-bold text-info">{flow.processedRecords.toLocaleString()}</div>
                  </TableCell>
                  <TableCell>
                    <div className={`text-sm font-bold ${getErrorRateColor(flow.errorRate)}`}>
                      {(flow.errorRate * 100).toFixed(2)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`${basePath}/flow/${flow.id}`)}
                      className="border-border/60 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {paginatedFlows.map((flow, index) => (
            <Card 
              key={flow.id} 
              className="group bg-card/50 backdrop-blur-xl border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all duration-500 animate-fade-in overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-transparent">
                <CardTitle className="text-foreground text-xl font-semibold flex items-start justify-between group-hover:text-primary transition-colors">
                  <span className="line-clamp-1">{flow.name}</span>
                  {getStatusBadge(flow.status)}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 p-6">
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Description</div>
                  <p className="text-sm text-foreground leading-relaxed line-clamp-3">{flow.description}</p>
                </div>
                
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div className="bg-muted/20 p-4 space-y-3">
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Last Execution</div>
                      <div className="text-foreground font-medium">{flow.lastRun}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Records Processed</div>
                      <div className="text-xl font-bold text-info">{flow.processedRecords.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Error Rate</div>
                      <div className={`text-lg font-bold ${getErrorRateColor(flow.errorRate)}`}>
                        {(flow.errorRate * 100).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/40 flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`${basePath}/flow/${flow.id}`)}
                    className="border-border/60 hover:bg-primary/10 hover:border-primary/40 transition-all duration-200 group-hover:scale-105"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {filteredFlows.length > 0 && (
        <div className="bg-card/50 backdrop-blur-xl border border-border/40 p-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground font-bold">{startIndex + 1}</span> to{" "}
              <span className="text-foreground font-bold">{Math.min(startIndex + pageSize, filteredFlows.length)}</span> of{" "}
              <span className="text-foreground font-bold">{filteredFlows.length}</span> flows
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={`transition-all duration-200 ${
                      currentPage <= 1 
                        ? "pointer-events-none opacity-50" 
                        : "hover:bg-primary/10 hover:border-primary/30"
                    }`}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                      className="transition-all duration-200 hover:bg-primary/10"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={`transition-all duration-200 ${
                      currentPage >= totalPages 
                        ? "pointer-events-none opacity-50" 
                        : "hover:bg-primary/10 hover:border-primary/30"
                    }`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      )}
    </>
  );
}