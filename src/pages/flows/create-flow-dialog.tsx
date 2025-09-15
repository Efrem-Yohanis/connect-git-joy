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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { flowService } from "@/services/flowService";

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mediationTypes = [
  { value: "charging", label: "Charging" },
  { value: "convergent", label: "Convergent" },
  { value: "ncc", label: "NCC (Network Call Control)" },
  { value: "sms", label: "SMS" },
  { value: "data", label: "Data" },
  { value: "voice", label: "Voice" },
  { value: "roaming", label: "Roaming" }
];

export function CreateFlowDialog({ open, onOpenChange }: CreateFlowDialogProps) {
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [mediationType, setMediationType] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    if (!mediationType) {
      toast.error("Please select a mediation type");
      return;
    }

    setIsLoading(true);
    
    try {
      // Create flow using the flow service - Note: mediation_type is stored in description for now
      const createdFlow = await flowService.createFlow({
        name: flowName.trim(),
        description: `${flowDescription.trim()}${flowDescription.trim() ? ' | ' : ''}Mediation Type: ${mediationType}`,
      });
      
      toast.success("Flow created successfully!");
      onOpenChange(false);
      setFlowName("");
      setFlowDescription("");
      setMediationType("");
      
      // Navigate to flow editor with the actual flow ID from API
      navigate(`/flows/${createdFlow.id}/edit`);
    } catch (error) {
      console.error('Error creating flow:', error);
      toast.error("Failed to create flow");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Flow</DialogTitle>
          <DialogDescription>
            Enter a name for your new data flow. You'll be taken to the flow editor once created.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="flowName" className="text-right">
              Name
            </Label>
            <Input
              id="flowName"
              value={flowName}
              onChange={(e) => setFlowName(e.target.value)}
              placeholder="Enter flow name..."
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === "Enter" && mediationType) {
                  handleCreate();
                }
              }}
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mediationType" className="text-right">
              Type
            </Label>
            <Select value={mediationType} onValueChange={setMediationType}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select mediation type..." />
              </SelectTrigger>
              <SelectContent>
                {mediationTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="flowDescription" className="text-right pt-2">
              Description
            </Label>
            <Textarea
              id="flowDescription"
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
            onClick={handleCreate}
            disabled={isLoading || !flowName.trim() || !mediationType}
          >
            {isLoading ? "Creating..." : "Create Flow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}