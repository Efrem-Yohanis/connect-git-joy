import { useState } from "react";
import { Plus, Upload, Download, Settings, Trash2, Eye, Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useNavigate } from "react-router-dom";

// Mock data for nodes
const mockNodes = [
  {
    id: "1",
    name: "Database Source",
    deployment: "deployed",
    createdDate: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2", 
    name: "Data Transform",
    deployment: "not_deployed",
    createdDate: "2024-01-10",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    name: "File Output",
    deployment: "deployed",
    createdDate: "2024-01-05",
    createdBy: "Bob Johnson",
  },
];

export function NodesPage() {
  const [nodes, setNodes] = useState(mockNodes);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const navigate = useNavigate();

  const filteredNodes = nodes.filter(node =>
    node.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDeploymentBadge = (deployment: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      deployed: { variant: "default", className: "bg-node-deployed text-white" },
      not_deployed: { variant: "outline", className: "text-node-undeployed border-node-undeployed" },
    };
    return variants[deployment] || { variant: "outline", className: "" };
  };

  const handleDelete = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
  };

  const handleExport = (node: any) => {
    const dataStr = JSON.stringify(node, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import Node
          </Button>
          <Button onClick={() => navigate("/nodes/new")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Node
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNodes.map((node) => (
            <Card key={node.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  {node.name}
                  <Badge 
                    variant={getDeploymentBadge(node.deployment).variant}
                    className={getDeploymentBadge(node.deployment).className}
                  >
                    {node.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Created:</span> {node.createdDate}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">By:</span> {node.createdBy}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">Status:</span>
                    <Badge 
                      variant={getDeploymentBadge(node.deployment).variant}
                      className={`${getDeploymentBadge(node.deployment).className} ml-2 text-xs`}
                    >
                      {node.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                    </Badge>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium text-foreground mb-2">Actions:</div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/nodes/${node.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport(node)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(node.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
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
                <TableHead>Deployment Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNodes.map((node) => (
                <TableRow key={node.id}>
                  <TableCell className="font-medium">{node.name}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getDeploymentBadge(node.deployment).variant}
                      className={getDeploymentBadge(node.deployment).className}
                    >
                      {node.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{node.createdDate}</TableCell>
                  <TableCell>{node.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/nodes/${node.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExport(node)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(node.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}