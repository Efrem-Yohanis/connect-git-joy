import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface CloneFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sourceFlow: any;
  onClone: (sourceFlow: any, newName: string, newDescription: string) => void;
}

export function CloneFlowDialog({ open, onOpenChange, sourceFlow, onClone }: CloneFlowDialogProps) {
  const [flowName, setFlowName] = useState(sourceFlow ? `${sourceFlow.name} (Copy)` : "");
  const [flowDescription, setFlowDescription] = useState(sourceFlow?.description || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleClone = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      onClone(sourceFlow, flowName.trim(), flowDescription.trim());
      toast.success("Flow cloned successfully!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to clone flow");
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when dialog opens with new source flow
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && sourceFlow) {
      setFlowName(`${sourceFlow.name} (Copy)`);
      setFlowDescription(sourceFlow.description || "");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clone Flow</DialogTitle>
          <DialogDescription>
            Create a copy of "{sourceFlow?.name}". Enter a new name and description for the cloned flow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cloneFlowName" className="text-right">
              Name
            </Label>
            <Input
              id="cloneFlowName"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Enter flow name..."
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleClone();
                }
              }}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="cloneFlowDescription" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="cloneFlowDescription"
              value={flowDescription}
              onChange={(e) => setFlowDescription(e.target.value)}
              placeholder="Enter flow description..."
              className="col-span-3 min-h-20"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleClone}
            disabled={isLoading || !flowName.trim()}
          >
            {isLoading ? "Cloning..." : "Clone Flow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}