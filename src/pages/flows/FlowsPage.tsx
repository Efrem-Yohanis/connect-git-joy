// src/FlowsPage.tsx
import { useEffect, useState } from "react";
import { Plus, Upload, Download, Trash2, Eye, Grid, List, Copy, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingCard } from "@/components/ui/loading";
import { useItems } from '../apis/ItemService'; // Using real API data
import { deleteItem } from '../apis/ItemService'; // Using real delete function
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CreateFlowDialog } from "./create-flow-dialog";
import { CloneFlowDialog } from "./clone-flow-dialog";
import { useNavigate } from "react-router-dom";

export function FlowsPage() {
  const { data: items, loading, error } = useItems();
  const [flows, setFlows] = useState(items || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCloneDialog, setShowCloneDialog] = useState(false);
  const [flowToClone, setFlowToClone] = useState<any>(null);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    if (items) {
      setFlows(items);
    }
  }, [items]);

  const filteredFlows = flows.filter(flow =>
    flow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredFlows.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedFlows = filteredFlows.slice(startIndex, startIndex + pageSize);

  const getFlowStatus = (flow: any) => {
    if (flow.is_running) return "running";
    if (flow.is_deployed) return "deployed";
    return "draft";
  };

  const getFlowType = (flow: any) => {
    if (!flow.description) return "Unknown";
    const typeMatch = flow.description.match(/Mediation Type: ([\w-]+)/);
    if (typeMatch) {
      const type = typeMatch[1];
      switch (type) {
        case "ncc": return "NCC";
        case "charging-gateway": return "Charging Gateway";
        case "convergent": return "Convergent";
        default: return type;
      }
    }
    return "Unknown";
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" => {
    switch (status) {
      case "running": return "default";
      case "deployed": return "secondary";
      case "draft": return "outline";
      default: return "outline";
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "running": return "🟢 Running";
      case "deployed": return "🟡 Deployed";
      case "draft": return "📝 Draft";
      default: return "❓ Unknown";
    }
  };

const handleDelete = async (flowId: string) => {
    try {
        await deleteItem(flowId); // Call the delete function
        setFlows(flows.filter(flow => flow.id !== flowId)); // Update the state
    } catch (error) {
        console.error('Failed to delete flow:', error);
    }
};




  const handleExport = (flow: any) => {
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.name}.json`;
    link.click();
  };

  const handleClone = (flow: any) => {
    setFlowToClone(flow);
    setShowCloneDialog(true);
  };

  const handleCloneConfirm = (sourceFlow: any, newName: string, newDescription: string) => {
    const clonedFlowId = Date.now().toString();
    const clonedFlow = {
      ...sourceFlow,
      id: clonedFlowId,
      name: newName,
      description: newDescription,
      is_active: false,
      is_deployed: false,
      created_at: new Date().toISOString(),
      created_by: "Current User"
    };
    setFlows([...flows, clonedFlow]);
    navigate(`/flows/${clonedFlowId}/edit`);
  };

  if (loading) {
    return <LoadingCard text="Loading flows..." />;
  }

  if (error) {
    return <div>Error loading flows: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="space-y-8 p-6">
        {/* Header Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary-glow/5 rounded-2xl" />
          <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-card">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Flow Management
                </h1>
                <p className="text-muted-foreground">
                  Create, manage, and monitor your data processing flows
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                Read-only view - Use DevTool for management operations
              </div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-subtle">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px] border-border/50 bg-background/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="🔍 Search flows..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm border-border/50 bg-background/50 focus:bg-background transition-colors"
          />
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex border border-border/50 rounded-lg bg-background/30 backdrop-blur-sm">
            <Button
              onClick={() => setViewMode("list")}
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              className={`rounded-r-none transition-all duration-200 ${
                viewMode === "list" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-primary/10"
              }`}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode("grid")}
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              className={`rounded-l-none transition-all duration-200 ${
                viewMode === "grid" ? "bg-primary text-primary-foreground shadow-sm" : "hover:bg-primary/10"
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
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl shadow-subtle overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 bg-muted/30">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Version</TableHead>
                <TableHead className="font-semibold">Created Date</TableHead>
                <TableHead className="font-semibold">Created By</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedFlows.map((flow) => (
                <TableRow key={flow.id} className="border-border/30 hover:bg-muted/20 transition-colors">
                  <TableCell className="font-semibold text-foreground">{flow.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-medium">
                      {getFlowType(flow)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadgeVariant(getFlowStatus(flow))}
                      className="font-medium"
                    >
                      {getStatusDisplay(getFlowStatus(flow))}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-muted-foreground">Version {flow.version}</span>
                  </TableCell>
                  <TableCell>{new Date(flow.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{flow.created_by}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/flows/${flow.id}`)}
                        className="border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedFlows.map((flow, index) => (
            <Card 
              key={flow.id} 
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 shadow-subtle hover:shadow-card transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <CardTitle className="text-foreground text-lg font-semibold flex items-center justify-between group-hover:text-primary transition-colors">
                  {flow.name}
                  <Badge 
                    variant={getStatusBadgeVariant(getFlowStatus(flow))}
                    className="font-medium"
                  >
                    {getStatusDisplay(getFlowStatus(flow))}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</div>
                    <Badge variant="outline" className="text-xs">{getFlowType(flow)}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Created</div>
                    <div className="text-foreground font-medium">{new Date(flow.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Version</div>
                    <Badge variant="outline" className="text-xs">{flow.version}</Badge>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">By</div>
                    <div className="text-foreground font-medium">{flow.created_by}</div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Description</div>
                    <p className="text-sm text-foreground line-clamp-2">{flow.description || "No description available"}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-border/50 flex justify-between items-center">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Actions</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-border/50 hover:bg-primary/10 hover:border-primary/30 transition-all group-hover:scale-110"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background/95 backdrop-blur-sm border border-border/50 shadow-elegant z-50">
                      <DropdownMenuItem onClick={() => navigate(`/flows/${flow.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredFlows.length > 0 && (
        <div className="bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium text-muted-foreground">
              Showing <span className="text-foreground font-semibold">{startIndex + 1}</span> to <span className="text-foreground font-semibold">{Math.min(startIndex + pageSize, filteredFlows.length)}</span> of <span className="text-foreground font-semibold">{filteredFlows.length}</span> flows
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
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
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
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          </div>
        </div>
      )}

      <CreateFlowDialog
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />

      <CloneFlowDialog
        open={showCloneDialog}
        onOpenChange={setShowCloneDialog}
        sourceFlow={flowToClone}
        onClone={handleCloneConfirm}
      />
      </div>
    </div>
  );
}