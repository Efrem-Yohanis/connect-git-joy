import { useState } from "react";
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

// Mock data
const mockNode = {
  id: "1",
  name: "User Data Processor",
  scriptName: "process_user_data.py",
  isDeployed: true,
  lastUpdatedBy: "John Doe",
  lastUpdatedAt: "2024-01-20 14:30:00",
  version: "v1.2",
  parameters: [
    { id: "1", key: "threshold", valueType: "int", defaultValue: "10", subnodeOverrides: 3 },
    { id: "2", key: "tag_prefix", valueType: "string", defaultValue: "user_", subnodeOverrides: 1 },
    { id: "3", key: "enabled", valueType: "boolean", defaultValue: "true", subnodeOverrides: 0 },
  ],
  subnodes: [
    { 
      id: "1", 
      name: "Data Validation", 
      deploymentStatus: "deployed", 
      scriptName: "validate.py"
    },
    { 
      id: "2", 
      name: "Data Transform", 
      deploymentStatus: "not_deployed", 
      scriptName: "transform.py"
    },
  ]
};

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [node, setNode] = useState(mockNode);
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  const handleDeploy = () => {
    setNode(prev => ({ ...prev, isDeployed: true }));
  };

  const handleUndeploy = () => {
    setNode(prev => ({ ...prev, isDeployed: false }));
  };

  const handleEdit = () => {
    if (node.isDeployed) {
      setShowVersionDialog(true);
    } else {
      navigate(`/nodes/${id}/edit`);
    }
  };

  const handleCreateVersion = () => {
    navigate(`/nodes/${id}/edit?version=new`);
    setShowVersionDialog(false);
  };

  const handleVersionHistory = () => {
    navigate(`/nodes/${id}/versions`);
  };

  const getStatusBadge = (status: string) => {
    return status === "deployed" 
      ? <Badge className="bg-green-500 text-white">🟢 Deployed</Badge>
      : <Badge className="bg-red-500 text-white">🔴 Not Deployed</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">📦 {node.name}</h1>
            <div className="flex items-center space-x-3 mt-2">
              {node.isDeployed 
                ? <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">🟢 Deployed</Badge>
                : <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">🔴 Not Deployed</Badge>
              }
              <Badge variant="outline">{node.version}</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            
            {!node.isDeployed && (
              <Button onClick={handleDeploy}>
                <Upload className="h-4 w-4 mr-2" />
                Deploy
              </Button>
            )}
            
            {node.isDeployed && (
              <Button variant="outline" onClick={handleUndeploy}>
                Undeploy
              </Button>
            )}
            
            <Button variant="outline" onClick={handleVersionHistory}>
              <History className="h-4 w-4 mr-2" />
              Version History
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated By</h4>
            <p className="font-medium">{node.lastUpdatedBy}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated At</h4>
            <p className="font-medium">{node.lastUpdatedAt}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Parameters</h4>
            <p className="font-medium">{node.parameters.length}</p>
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
          <CardTitle>Parameters ({node.parameters.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Value Type</TableHead>
                <TableHead>Subnode Overrides</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {node.parameters.map((param) => (
                <TableRow key={param.id}>
                  <TableCell className="font-medium">{param.key}</TableCell>
                  <TableCell>{param.defaultValue}</TableCell>
                  <TableCell>{param.valueType}</TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      size="sm"
                      onClick={() => navigate(`/parameters/${param.id}`)}
                      className="h-auto p-0"
                    >
                      {param.subnodeOverrides} overrides
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                  </TableCell>
                </TableRow>
              ))}
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
                <TableHead>Script Name</TableHead>
                <TableHead>Deployment Status</TableHead>
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
                  <TableCell>{subnode.scriptName}</TableCell>
                  <TableCell>{getStatusBadge(subnode.deploymentStatus)}</TableCell>
                  <TableCell className="text-right">
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              This node is currently deployed. A new version will be created to edit. Do you want to continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion}>
              Create New Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}