import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UniformDetailHeader } from "@/components/UniformDetailHeader";
import { UniformDetailBackButton } from "@/components/UniformDetailBackButton";
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
    <div className="space-y-6 p-6">
      {/* Uniform Header */}
      <UniformDetailHeader
        name={parameter.key}
        status={parameter.is_active ? 'deployed' : 'draft'}
        backRoute="/devtool"
        backTab="parameters"
        onToggleDeployment={parameter.is_active ? handleUndeploy : handleDeploy}
        isLoading={deploying}
      />

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

      {/* Back Button */}
      <UniformDetailBackButton backRoute="/devtool" backTab="parameters" />
    </div>
  );
}