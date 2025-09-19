import { useState, useEffect } from "react";
import { Plus, Upload, Download, Settings, Trash2, Eye, Grid2X2, List, Copy, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useNavigate } from "react-router-dom";
import { useSubnodes, subnodeService } from "@/services/subnodeService";
import { toast } from "sonner";
import { LoadingCard } from "@/components/ui/loading";

export function SubnodesPage() {
  const { data: subnodesData, loading, error, refetch } = useSubnodes();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const subnodes = subnodesData?.results || [];

  if (loading) {
    return <LoadingCard text="Loading subnodes..." className="min-h-[400px]" />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading subnodes: {error}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const filteredSubnodes = subnodes.filter(subnode =>
    subnode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (subnode.node_family_name && subnode.node_family_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredSubnodes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSubnodes = filteredSubnodes.slice(startIndex, startIndex + pageSize);

  const getDeploymentBadge = (activeVersion: number | null) => {
    return activeVersion 
      ? { variant: "default" as const, className: "bg-node-deployed text-white" }
      : { variant: "outline" as const, className: "text-node-undeployed border-node-undeployed" };
  };

  const handleDelete = async (subnodeId: string) => {
    try {
      await subnodeService.deleteSubnode(subnodeId);
      toast.success("Subnode deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete subnode");
      console.error("Delete error:", error);
    }
  };

  const handleExport = (subnode: any) => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name}.json`;
    link.click();
  };

  const handleClone = async (subnode: any) => {
    try {
      await subnodeService.cloneSubnode(subnode.id, { name: `${subnode.name}_clone` });
      toast.success("Subnode cloned successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to clone subnode");
      console.error("Clone error:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              setPageSize(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
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
            placeholder="Search subnodes..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex border border-border rounded-md">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Read-only view - Use DevTool for management operations
          </div>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedSubnodes.map((subnode) => (
            <Card key={subnode.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  {subnode.name}
                  <Badge 
                    variant={getDeploymentBadge(subnode.active_version).variant}
                    className={getDeploymentBadge(subnode.active_version).className}
                  >
                    {subnode.active_version ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Node Family:</span>
                    <Badge variant="outline" className="ml-2">{subnode.node_family_name || subnode.node_family}</Badge>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">Active Version:</span> 
                    <span className="ml-1">{subnode.active_version || 'None'}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Last Updated By:</span> {subnode.updated_by || 'Unknown'}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">Last Updated At:</span> {formatDate(subnode.updated_at)}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <div className="text-xs font-medium text-foreground">Actions:</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg z-50">
                      <DropdownMenuItem onClick={() => navigate(`/subnodes/${subnode.id}`)}>
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
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SubNode Name</TableHead>
                <TableHead>Node Family</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated By</TableHead>
                <TableHead>Last Updated At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubnodes.map((subnode) => (
                <TableRow key={subnode.id}>
                  <TableCell className="font-medium">{subnode.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subnode.node_family_name || subnode.node_family}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{subnode.active_version || 'None'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getDeploymentBadge(subnode.active_version).variant}
                      className={getDeploymentBadge(subnode.active_version).className}
                    >
                      {subnode.active_version ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{subnode.updated_by || 'Unknown'}</TableCell>
                  <TableCell>{formatDate(subnode.updated_at)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/subnodes/${subnode.id}`)}
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
      )}

      {filteredSubnodes.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredSubnodes.length)} of {filteredSubnodes.length} subnodes
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
      )}
    </div>
  );
}