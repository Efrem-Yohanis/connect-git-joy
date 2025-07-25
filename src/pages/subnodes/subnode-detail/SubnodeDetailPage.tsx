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
  Download, 
  Trash2, 
  Edit, 
  Upload,
  ExternalLink
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data
const mockSubnode = {
  id: "1",
  name: "Data Validation Subnode",
  scriptName: "validate_data.py",
  parentNode: "User Data Processor",
  parentNodeId: "1",
  isDeployed: true,
  createdAt: "2024-01-16",
  createdBy: "Jane Smith",
  version: "v1",
  parameters: [
    { 
      id: "1", 
      key: "threshold", 
      valueType: "int", 
      overrideValue: "15",
      defaultValue: "10"
    },
    { 
      id: "2", 
      key: "tag_prefix", 
      valueType: "string", 
      overrideValue: "validated_",
      defaultValue: "user_"
    },
    { 
      id: "3", 
      key: "enabled", 
      valueType: "boolean", 
      overrideValue: "true",
      defaultValue: "true"
    },
  ]
};

export function SubnodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subnode, setSubnode] = useState(mockSubnode);
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  const handleDeploy = () => {
    setSubnode(prev => ({ ...prev, isDeployed: true }));
  };

  const handleUndeploy = () => {
    setSubnode(prev => ({ ...prev, isDeployed: false }));
  };

  const handleEdit = () => {
    if (subnode.isDeployed) {
      setShowVersionDialog(true);
    } else {
      navigate(`/subnodes/${id}/edit`);
    }
  };

  const handleCreateVersion = () => {
    navigate(`/subnodes/${id}/edit?version=new`);
    setShowVersionDialog(false);
  };

  const handleDelete = () => {
    navigate('/subnodes');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">🧩 {subnode.name} ({subnode.version})</h1>
          {subnode.isDeployed 
            ? <Badge className="bg-green-500 text-white">🟢 Deployed</Badge>
            : <Badge className="bg-red-500 text-white">🔴 Not Deployed</Badge>
          }
        </div>
        
        <div className="flex items-center space-x-2">
          {!subnode.isDeployed && (
            <Button onClick={handleDeploy}>
              <Upload className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          )}
          
          {subnode.isDeployed && (
            <Button variant="outline" onClick={handleUndeploy}>
              <Download className="h-4 w-4 mr-2" />
              Undeploy
            </Button>
          )}
          
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit (Create New Version)
          </Button>
          
        </div>
      </div>

      {/* SubNode Information */}
      <Card>
        <CardHeader>
          <CardTitle>SubNode Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold">Script Name</h4>
              <p className="text-muted-foreground">{subnode.scriptName}</p>
            </div>
            <div>
              <h4 className="font-semibold">Parent Node</h4>
              <div className="flex items-center space-x-2">
                <p className="text-muted-foreground">{subnode.parentNode}</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/nodes/${subnode.parentNodeId}`)}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Last Updated By</h4>
              <p className="text-muted-foreground">{subnode.createdBy}</p>
            </div>
            <div>
              <h4 className="font-semibold">Last Modified Date</h4>
              <p className="text-muted-foreground">{subnode.createdAt}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters Section */}
      <Card>
        <CardHeader>
          <CardTitle>Parameters (Inherited from Parent Node)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Value Type</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Override Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subnode.parameters.map((param) => (
                <TableRow key={param.id}>
                  <TableCell className="font-medium">{param.key}</TableCell>
                  <TableCell>{param.valueType}</TableCell>
                  <TableCell>{param.defaultValue}</TableCell>
                  <TableCell className="font-medium">
                    {param.overrideValue !== param.defaultValue ? (
                      <span className="text-blue-600">{param.overrideValue}</span>
                    ) : (
                      <span className="text-muted-foreground">{param.overrideValue}</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {param.overrideValue !== param.defaultValue ? (
                      <Badge variant="secondary">🔧 Overridden</Badge>
                    ) : (
                      <Badge variant="outline">📋 Default</Badge>
                    )}
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
              This SubNode is deployed. To make changes, a new version will be created. Continue?
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