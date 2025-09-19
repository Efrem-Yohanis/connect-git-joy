import { useState, useEffect } from "react";
import { Plus, Upload, Download, Settings, Trash2, Eye, Grid2X2, List, Copy, MoreVertical } from "lucide-react";
import { LoadingCard } from "@/components/ui/loading";
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface NodeFamily {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_deployed: boolean;
  published_version: number | null;
  versions: {
    id: string;
    version: number;
    state: string;
    changelog: string;
    family: string;
    family_name: string;
    script_url: string | null;
    parameters: {
      id: string;
      parameter_id: string;
      key: string;
      value: string;
      datatype: string;
    }[];
    subnodes: {
      link_id: string;
      order: number;
      family: {
        id: string;
        name: string;
        is_deployed: boolean;
      };
      version: {
        id: string;
        version: number;
        state: string;
        parameters: {
          key: string;
          value: string;
          datatype: string;
        }[];
      };
    }[];
    created_at: string;
    created_by: string;
  }[];
}

interface ApiResponse {
  total: number;
  published: number;
  draft: number;
  results: NodeFamily[];
}

export function NodesPage() {
  const [nodes, setNodes] = useState<NodeFamily[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get<ApiResponse>("http://127.0.0.1:8000/api/node-families/");
      
      // Extract results array from the API response
      const data = response.data;
      if (data && Array.isArray(data.results)) {
        setNodes(data.results);
      } else {
        console.error("API response does not contain results array:", data);
        setNodes([]);
        setError("Invalid response format from server");
      }
    } catch (err: any) {
      console.error("Error fetching nodes:", err);
      setNodes([]); // Ensure nodes is always an array
      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch nodes";
      setError(errorMessage);
      toast({
        title: "Error Loading Nodes",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredNodes = nodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNodes.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedNodes = filteredNodes.slice(startIndex, startIndex + pageSize);

  const handleDelete = async (nodeId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/node-families/${nodeId}/`);
      setNodes(nodes.filter(node => node.id !== nodeId));
      toast({
        title: "Node Deleted",
        description: "The node has been deleted successfully.",
      });
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to delete node";
      toast({
        title: "Error Deleting Node",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleExport = (node: NodeFamily) => {
    const dataStr = JSON.stringify(node, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name}.json`;
    link.click();
  };

  const handleClone = async (node: NodeFamily) => {
    try {
      const clonedNodeData = {
        name: `${node.name} (Copy)`,
        description: node.description
      };
      const response = await axios.post("http://127.0.0.1:8000/api/node-families/", clonedNodeData);
      await fetchNodes(); // Refresh the list
      navigate(`/nodes/${response.data.id}/edit`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to clone node";
      toast({
        title: "Error Cloning Node",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <LoadingCard text="Loading nodes..." />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={fetchNodes}>Try Again</Button>
        </div>
      </div>
    );
  }

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
            placeholder="Search nodes..."
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
          {paginatedNodes.map((node) => (
            <Card key={node.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  {node.name}
                  <Badge variant="outline">{node.is_deployed ? 'Deployed' : 'Draft'}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Created:</span> {new Date(node.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">By:</span> {node.created_by || "System"}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Versions:</span> {node.versions?.length || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Latest Version:</span> {Math.max(...(node.versions?.map(v => v.version) || [0]))}
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
                      <DropdownMenuItem onClick={() => navigate(`/nodes/${node.id}`)}>
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
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{node.is_deployed ? 'Deployed' : 'Draft'}</Badge>
                  </TableCell>
                  <TableCell>{new Date(node.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>{node.created_by || "System"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/nodes/${node.id}`)}
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

      {filteredNodes.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredNodes.length)} of {filteredNodes.length} nodes
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