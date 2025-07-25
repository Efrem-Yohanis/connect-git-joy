import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Trash2, 
  Edit, 
  Play, 
  Square, 
  Upload,
  History
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlowCanvas } from "./flow-canvas";

// Mock data - replace with API calls
const mockFlow = {
  id: "1",
  name: "Daily 3 Birr Loan",
  code: "LOAN_D_S_3",
  description: "DAILY_CBU_SMS_3BIRR_LOAN_OF",
  status: "running",
  deployment: "deployed",
  createdDate: "2024-01-15",
  lastUpdatedBy: "John Doe",
  version: "v1",
  isDeployed: true,
  isRunning: true,
};

export function FlowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flow, setFlow] = useState(mockFlow);
  const [showVersionDialog, setShowVersionDialog] = useState(false);

  const getStatusBadge = () => {
    if (flow.isRunning) {
      return <Badge className="bg-green-500 text-white">🟢 Running</Badge>;
    } else if (flow.isDeployed) {
      return <Badge className="bg-yellow-500 text-white">🟡 Deployed</Badge>;
    } else {
      return <Badge className="bg-red-500 text-white">🔴 Not Deployed</Badge>;
    }
  };

  const handleDeploy = () => {
    setFlow(prev => ({ ...prev, isDeployed: true }));
  };

  const handleUndeploy = () => {
    setFlow(prev => ({ ...prev, isDeployed: false, isRunning: false }));
  };

  const handleStart = () => {
    setFlow(prev => ({ ...prev, isRunning: true }));
  };

  const handleStop = () => {
    setFlow(prev => ({ ...prev, isRunning: false }));
  };

  const handleEdit = () => {
    if (flow.isDeployed) {
      setShowVersionDialog(true);
    } else {
      navigate(`/flows/${id}/edit`);
    }
  };

  const handleCreateVersion = () => {
    // Create new version logic
    navigate(`/flows/${id}/edit?version=new`);
    setShowVersionDialog(false);
  };

  const handleDelete = () => {
    // Delete flow logic
    navigate('/flows');
  };

  const handleExport = () => {
    // Export JSON logic
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.name}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">📘 {flow.name} ({flow.version})</h1>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center space-x-2">
          {!flow.isDeployed && (
            <Button onClick={handleDeploy}>
              <Upload className="h-4 w-4 mr-2" />
              Deploy
            </Button>
          )}
          
          {flow.isDeployed && (
            <Button variant="outline" onClick={handleUndeploy}>
              <Download className="h-4 w-4 mr-2" />
              Undeploy
            </Button>
          )}
          
          {flow.isDeployed && !flow.isRunning && (
            <Button onClick={handleStart}>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          
          {flow.isRunning && (
            <Button variant="outline" onClick={handleStop}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Flow
          </Button>
          
        </div>
      </div>

      {/* Flow Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Flow Code</h3>
          <p className="text-muted-foreground">{flow.code}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p className="text-muted-foreground">{flow.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Created Date</h3>
          <p className="text-muted-foreground">{flow.createdDate}</p>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="border rounded-lg h-96">
        <FlowCanvas readOnly />
      </div>

      {/* Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              This flow is currently deployed. To edit, a new version will be created. Proceed?
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