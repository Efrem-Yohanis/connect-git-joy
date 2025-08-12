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
  Play,
  Square
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
  const [deploying, setDeploying] = useState(false);
  const { toast } = useToast();

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading parameter...</div>;
  }

  if (error || !parameter) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error || 'Parameter not found'}</div>;
  }

  const handleEdit = () => {
    if (parameter.is_active) {
      toast({
        title: "Cannot edit deployed parameter",
        description: "Undeploy the parameter first to edit it.",
        variant: "destructive",
      });
      return;
    }
    navigate(`/parameters/${id}/edit`);
  };

  const handleDeploy = async () => {
    setDeploying(true);
    try {
      await parameterService.deployParameter(parameter.id);
      toast({
        title: "Parameter deployed successfully",
        description: "The parameter is now active.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error deploying parameter",
        description: "Failed to deploy the parameter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeploying(false);
    }
  };

  const handleUndeploy = async () => {
    setDeploying(true);
    try {
      await parameterService.undeployParameter(parameter.id);
      toast({
        title: "Parameter undeployed successfully",
        description: "The parameter is now in draft mode.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error undeploying parameter",
        description: "Failed to undeploy the parameter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeploying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl font-bold">🧩 {parameter.key}</h1>
              <Badge variant={parameter.is_active ? "default" : "secondary"}>
                {parameter.is_active ? "🟢 Published" : "⚪ Draft"}
              </Badge>
            </div>
            <div className="flex items-center space-x-3 mt-2">
              <span className="text-muted-foreground">Default Value:</span>
              <span className="font-medium">{parameter.default_value}</span>
              <Badge variant={parameter.required ? "default" : "secondary"}>
                {parameter.required ? "Required" : "Optional"}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={handleEdit}
              disabled={parameter.is_active}
              title="Edit Parameter"
            >
              <Edit className="h-4 w-4" />
            </Button>

            {parameter.is_active ? (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleUndeploy}
                disabled={deploying}
                title="Undeploy Parameter"
              >
                <Square className="h-4 w-4" />
              </Button>
            ) : (
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleDeploy}
                disabled={deploying}
                title="Deploy Parameter"
              >
                <Play className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
              <span className="font-medium text-muted-foreground">Data Type:</span>
              <p className="font-mono">{parameter.datatype}</p>
            </div>
            <div>
              <span className="font-medium text-muted-foreground">Required:</span>
              <Badge variant={parameter.required ? "default" : "secondary"} className="ml-2">
                {parameter.required ? "Required" : "Optional"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}