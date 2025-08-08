import { Save, Play, Square, Upload, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface FlowEditorToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onDeleteNode: () => void;
  hasSelectedNode: boolean;
}

export function FlowEditorToolbar({ 
  flowName, 
  onFlowNameChange, 
  onDeleteNode,
  hasSelectedNode 
}: FlowEditorToolbarProps) {
  const navigate = useNavigate();

  const handleSave = () => {
    toast.success("Flow saved successfully!");
    navigate("/flows");
  };

  const handleDeploy = () => {
    toast.success("Flow deployed successfully!");
  };

  const handleStart = () => {
    toast.success("Flow started successfully!");
  };

  const handleStop = () => {
    toast.success("Flow stopped successfully!");
  };

  const handleExport = () => {
    toast.success("Flow exported successfully!");
  };

  return (
    <div className="h-16 border-b border-border bg-background px-6 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Input
          value={flowName}
          onChange={(e) => onFlowNameChange(e.target.value)}
          className="font-medium text-lg border-none shadow-none focus-visible:ring-0 px-0"
          style={{ fontSize: "18px" }}
        />
      </div>

      <div className="flex items-center space-x-2">
        {hasSelectedNode && (
          <>
            <Button variant="outline" size="sm" onClick={onDeleteNode}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Node
            </Button>
            <div className="h-6 w-px bg-border" />
          </>
        )}
        
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Flow
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleDeploy}>
          <Upload className="h-4 w-4 mr-2" />
          Deploy Flow
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleStart}>
          <Play className="h-4 w-4 mr-2" />
          Start Flow
        </Button>
        
        <Button variant="outline" size="sm" onClick={handleStop}>
          <Square className="h-4 w-4 mr-2" />
          Stop Flow
        </Button>
        
      </div>
    </div>
  );
}