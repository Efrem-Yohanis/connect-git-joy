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
import { Input } from "@/components/ui/input";
import { 
  Edit, 
  Download,
  Trash2,
  Save,
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
const mockParameter = {
  id: "1",
  key: "threshold",
  defaultValue: "10",
  valueType: "int",
  parentNode: {
    id: "1",
    name: "User Data Processor",
    status: "deployed"
  },
  lastUpdatedBy: "Jane Smith",
  lastUpdatedAt: "2024-01-18 16:45:00",
  subnodeUsage: [
    {
      id: "1",
      subnodeName: "Data Validation",
      overrideValue: "15",
      subnodeStatus: "deployed",
      parentNodeName: "User Data Processor"
    },
    {
      id: "2", 
      subnodeName: "Data Transform",
      overrideValue: "10",
      subnodeStatus: "not_deployed", 
      parentNodeName: "User Data Processor"
    },
    {
      id: "3",
      subnodeName: "Data Cleanup",
      overrideValue: "20",
      subnodeStatus: "deployed",
      parentNodeName: "User Data Processor"
    }
  ]
};

export function ParameterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [parameter, setParameter] = useState(mockParameter);
  const [editingOverrides, setEditingOverrides] = useState<{[key: string]: string}>({});
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  const handleEdit = () => {
    if (parameter.parentNode.status === "deployed") {
      setShowVersionDialog(true);
    } else {
      navigate(`/parameters/${id}/edit`);
    }
  };

  const handleCreateVersion = () => {
    navigate(`/parameters/${id}/edit?version=new`);
    setShowVersionDialog(false);
  };

  const handleDelete = () => {
    navigate('/parameters');
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(parameter, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `parameter_${parameter.key}.json`;
    link.click();
  };

  const getStatusBadge = (status: string) => {
    return status === "deployed" 
      ? <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">🟢 Deployed</Badge>
      : <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">🔴 Not Deployed</Badge>;
  };

  const handleOverrideEdit = (subnodeId: string, value: string) => {
    setEditingOverrides(prev => ({
      ...prev,
      [subnodeId]: value
    }));
  };

  const handleSaveOverride = (subnodeId: string) => {
    const newValue = editingOverrides[subnodeId];
    setParameter(prev => ({
      ...prev,
      subnodeUsage: prev.subnodeUsage.map(usage =>
        usage.id === subnodeId 
          ? { ...usage, overrideValue: newValue }
          : usage
      )
    }));
    setEditingOverrides(prev => {
      const updated = { ...prev };
      delete updated[subnodeId];
      return updated;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧩 {parameter.key}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-muted-foreground">Default Value:</span>
              <span className="font-medium">{parameter.defaultValue}</span>
              <Badge variant="outline">{parameter.valueType}</Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Parameter</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this parameter? This action cannot be undone and will affect all associated subnodes.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-muted-foreground">Parent Node</h4>
            <Button 
              variant="link" 
              className="h-auto p-0 font-medium"
              onClick={() => navigate(`/nodes/${parameter.parentNode.id}`)}
            >
              {parameter.parentNode.name}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Node Status</h4>
            <div className="mt-1">
              {getStatusBadge(parameter.parentNode.status)}
            </div>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated By</h4>
            <p className="font-medium">{parameter.lastUpdatedBy}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated At</h4>
            <p className="font-medium">{parameter.lastUpdatedAt}</p>
          </div>
        </div>
      </div>

      {/* Subnode Usage Section */}
      <Card>
        <CardHeader>
          <CardTitle>Subnodes Using This Parameter ({parameter.subnodeUsage.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subnode Name</TableHead>
                <TableHead>Override Value</TableHead>
                <TableHead>Subnode Status</TableHead>
                <TableHead>Node (Parent)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameter.subnodeUsage.map((usage) => (
                <TableRow key={usage.id}>
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 font-medium"
                      onClick={() => navigate(`/subnodes/${usage.id}`)}
                    >
                      {usage.subnodeName}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {editingOverrides[usage.id] !== undefined ? (
                      <div className="flex items-center space-x-2">
                        <Input
                          value={editingOverrides[usage.id]}
                          onChange={(e) => handleOverrideEdit(usage.id, e.target.value)}
                          className="w-24"
                        />
                        <Button 
                          size="sm" 
                          onClick={() => handleSaveOverride(usage.id)}
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className={usage.overrideValue !== parameter.defaultValue ? "text-blue-600 font-medium" : "text-muted-foreground"}
                      >
                        {usage.overrideValue}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(usage.subnodeStatus)}</TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="h-auto p-0"
                      onClick={() => navigate(`/nodes/${parameter.parentNode.id}`)}
                    >
                      {usage.parentNodeName}
                    </Button>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleOverrideEdit(usage.id, usage.overrideValue)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Value
                    </Button>
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
              This parameter's parent node is deployed. A new version will be created to edit. Do you want to continue?
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