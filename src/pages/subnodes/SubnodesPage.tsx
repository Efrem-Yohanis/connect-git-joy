import { useState } from "react";
import { Plus, Upload, Download, Settings, Trash2, Eye, Grid2X2, List, Copy } from "lucide-react";
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

// Mock data for subnodes
const mockSubnodes = [
  {
    id: "1",
    name: "PostgreSQL Connector",
    parentNode: "Database Source",
    scriptName: "postgres_connect.py",
    deployment: "deployed",
    createdDate: "2024-01-15",
    createdBy: "John Doe",
  },
  {
    id: "2", 
    name: "CSV Parser",
    parentNode: "Data Transform",
    scriptName: "csv_parser.py",
    deployment: "not_deployed",
    createdDate: "2024-01-10",
    createdBy: "Jane Smith",
  },
  {
    id: "3",
    name: "S3 Uploader",
    parentNode: "File Output",
    scriptName: "s3_upload.py",
    deployment: "deployed",
    createdDate: "2024-01-05",
    createdBy: "Bob Johnson",
  },
];

export function SubnodesPage() {
  const [subnodes, setSubnodes] = useState(mockSubnodes);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const navigate = useNavigate();

  const filteredSubnodes = subnodes.filter(subnode =>
    subnode.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subnode.parentNode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDeploymentBadge = (deployment: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string }> = {
      deployed: { variant: "default", className: "bg-node-deployed text-white" },
      not_deployed: { variant: "outline", className: "text-node-undeployed border-node-undeployed" },
    };
    return variants[deployment] || { variant: "outline", className: "" };
  };

  const handleDelete = (subnodeId: string) => {
    setSubnodes(subnodes.filter(subnode => subnode.id !== subnodeId));
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

  const handleClone = (subnode: any) => {
    const clonedSubnode = {
      ...subnode,
      id: Date.now().toString(),
      name: `${subnode.name} (Copy)`,
      deployment: "not_deployed",
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: "Current User"
    };
    setSubnodes([...subnodes, clonedSubnode]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search subnodes..."
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
            Import SubNode
          </Button>
          <Button onClick={() => navigate("/subnodes/create")}>
            <Plus className="h-4 w-4 mr-2" />
            Create New SubNode
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSubnodes.map((subnode) => (
            <Card key={subnode.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  {subnode.name}
                  <Badge 
                    variant={getDeploymentBadge(subnode.deployment).variant}
                    className={getDeploymentBadge(subnode.deployment).className}
                  >
                    {subnode.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Parent Node:</span>
                    <Badge variant="outline" className="ml-2">{subnode.parentNode}</Badge>
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">Script:</span> 
                    <span className="font-mono ml-1">{subnode.scriptName}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Created:</span> {subnode.createdDate}
                  </div>
                  <div className="text-muted-foreground">
                    <span className="font-medium">By:</span> {subnode.createdBy}
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium text-foreground mb-2">Actions:</div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/subnodes/${subnode.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport(subnode)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleClone(subnode)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(subnode.id)}
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
                <TableHead>SubNode Name</TableHead>
                <TableHead>Parent Node</TableHead>
                <TableHead>Script Name</TableHead>
                <TableHead>Deployment Status</TableHead>
                <TableHead>Created Date</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSubnodes.map((subnode) => (
                <TableRow key={subnode.id}>
                  <TableCell className="font-medium">{subnode.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{subnode.parentNode}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{subnode.scriptName}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getDeploymentBadge(subnode.deployment).variant}
                      className={getDeploymentBadge(subnode.deployment).className}
                    >
                      {subnode.deployment === "deployed" ? "Deployed" : "Not Deployed"}
                    </Badge>
                  </TableCell>
                  <TableCell>{subnode.createdDate}</TableCell>
                  <TableCell>{subnode.createdBy}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/subnodes/${subnode.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExport(subnode)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleClone(subnode)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(subnode.id)}
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