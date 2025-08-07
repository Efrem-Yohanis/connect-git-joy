import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Edit, 
  Upload,
  Eye,
  FileText,
  History
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

interface NodeDetail {
  id: string;
  name: string;
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
  subnodes: {
    id: string;
    name: string;
    version: number;
    is_selected: boolean;
    parameters: {
      id: string;
      node: string;
      key: string;
      default_value: string;
      required: boolean;
      last_updated_by: string | null;
      last_updated_at: string;
    }[];
  }[];
}

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [node, setNode] = useState<NodeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  useEffect(() => {
    if (id) {
      fetchNode();
    }
  }, [id]);

  const fetchNode = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://127.0.0.1:8000/api/nodes/${id}/`);
      setNode(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || "Failed to fetch node";
      setError(errorMessage);
      toast({
        title: "Error Loading Node",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/nodes/${id}/edit`);
  };

  const handleVersionHistory = () => {
    navigate(`/nodes/${id}/versions`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading node details...</p>
        </div>
      </div>
    );
  }

  if (error || !node) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error || "Node not found"}</p>
          <Button onClick={fetchNode}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📦 {node.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <Badge variant="outline">v{node.version}</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            <Button variant="outline" onClick={handleVersionHistory}>
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated By</h4>
            <p className="font-medium">{node.last_updated_by || "System"}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated At</h4>
            <p className="font-medium">{new Date(node.last_updated_at).toLocaleString()}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Parameters</h4>
            <p className="font-medium">{node.subnodes.reduce((total, subnode) => total + subnode.parameters.length, 0)}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Subnodes</h4>
            <p className="font-medium">{node.subnodes.length}</p>
          </div>
        </div>
      </div>


      {/* Parameters Section */}
      <Card>
        <CardHeader>
          <CardTitle>Parameters ({node.subnodes.reduce((total, subnode) => total + subnode.parameters.length, 0)})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Subnode</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {node.subnodes.flatMap(subnode => 
                subnode.parameters.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-medium">{param.key}</TableCell>
                    <TableCell>{param.default_value}</TableCell>
                    <TableCell>
                      <Badge variant={param.required ? "default" : "secondary"}>
                        {param.required ? "Required" : "Optional"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="link" 
                        size="sm"
                        onClick={() => navigate(`/subnodes/${subnode.id}`)}
                        className="h-auto p-0"
                      >
                        {subnode.name}
                      </Button>
                    </TableCell>
                    <TableCell>{new Date(param.last_updated_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/parameters/${param.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subnodes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Subnodes ({node.subnodes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subnode Name</TableHead>
                <TableHead>Version</TableHead>
                <TableHead>Selected</TableHead>
                <TableHead>Parameters</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {node.subnodes.map((subnode) => (
                <TableRow key={subnode.id}>
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 font-medium"
                      onClick={() => navigate(`/subnodes/${subnode.id}`)}
                    >
                      {subnode.name}
                    </Button>
                  </TableCell>
                  <TableCell>v{subnode.version}</TableCell>
                  <TableCell>
                    <Badge variant={subnode.is_selected ? "default" : "secondary"}>
                      {subnode.is_selected ? "Selected" : "Not Selected"}
                    </Badge>
                  </TableCell>
                  <TableCell>{subnode.parameters.length} parameters</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/subnodes/${subnode.id}`)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

    </div>
  );
}