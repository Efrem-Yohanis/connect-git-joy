import { Save, Trash2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { flowService } from "@/services/flowService";

interface FlowEditorToolbarProps {
  flowName: string;
  onFlowNameChange: (name: string) => void;
  onDeleteNode: () => void;
  hasSelectedNode: boolean;
  flowId?: string;
}

export function FlowEditorToolbar({ 
  flowName, 
  onFlowNameChange, 
  onDeleteNode,
  hasSelectedNode,
  flowId
}: FlowEditorToolbarProps) {
  const navigate = useNavigate();

  const handleSave = async () => {
    try {
      // Validate first
      const result = await flowService.validateFlow(flowId || flowName);
      
      if (result.valid) {
        toast.success("Flow saved and validated successfully!");
        navigate("/flows");
      } else {
        toast.error(`Validation failed: ${result.errors?.length || 0} errors found`);
      }
    } catch (error) {
      toast.error("Failed to save flow");
    }
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
        
        <Button variant="default" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Flow
        </Button>
      </div>
    </div>
  );
}