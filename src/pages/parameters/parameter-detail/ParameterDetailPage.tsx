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
import { useParameter, parameterService } from "@/services/parameterService";
import { useToast } from "@/hooks/use-toast";

export function ParameterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: parameter, loading, error, refetch } = useParameter(id!);
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading parameter...</div>;
  }

  if (error || !parameter) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error || 'Parameter not found'}</div>;
  }

  const handleEdit = () => {
    navigate(`/parameters/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await parameterService.deleteParameter(parameter.id);
      toast({
        title: "Parameter deleted successfully",
        description: "The parameter has been removed.",
      });
      navigate('/parameters');
    } catch (error) {
      toast({
        title: "Error deleting parameter",
        description: "Failed to delete the parameter. Please try again.",
        variant: "destructive",
      });
    }
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">🧩 {parameter.key}</h1>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-muted-foreground">Default Value:</span>
              <span className="font-medium">{parameter.default_value}</span>
              <Badge variant={parameter.required ? "default" : "secondary"}>
                {parameter.required ? "Required" : "Optional"}
              </Badge>
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
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-muted-foreground">Node ID</h4>
            <Button 
              variant="link" 
              className="h-auto p-0 font-medium"
              onClick={() => navigate(`/nodes/${parameter.node}`)}
            >
              {parameter.node}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated By</h4>
            <p className="font-medium">{parameter.last_updated_by || 'System'}</p>
          </div>
          <div>
            <h4 className="font-medium text-muted-foreground">Last Updated At</h4>
            <p className="font-medium">{new Date(parameter.last_updated_at).toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Parameter Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <span className="font-medium text-muted-foreground">Parameter Key:</span>
              <p className="font-mono text-lg">{parameter.key}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Default Value:</span>
              <p className="font-mono">{parameter.default_value}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Required:</span>
              <Badge variant={parameter.required ? "default" : "secondary"} className="ml-2">
                {parameter.required ? "Required" : "Optional"}
              </Badge>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Associated Node:</span>
              <Button 
                variant="link" 
                className="h-auto p-0 font-medium ml-2"
                onClick={() => navigate(`/nodes/${parameter.node}`)}
              >
                {parameter.node}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}