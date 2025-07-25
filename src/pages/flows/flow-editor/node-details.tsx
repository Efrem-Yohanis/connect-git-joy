import { useState } from "react";
import { Node } from "@xyflow/react";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NodeDetailsProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, updates: any) => void;
}

export function NodeDetails({ selectedNode, onUpdateNode }: NodeDetailsProps) {
  const [isSubnodesOpen, setIsSubnodesOpen] = useState(true);
  const [isParamsOpen, setIsParamsOpen] = useState(true);

  if (!selectedNode) {
    return (
      <div className="w-80 border-l border-border bg-muted/50 p-4">
        <div className="text-center text-muted-foreground">
          <p>Select a node to view details</p>
        </div>
      </div>
    );
  }

  const handleAddSubnode = () => {
    const newSubnode = {
      id: `subnode-${Date.now()}`,
      name: "New Subnode",
      scriptName: "",
      deployed: false,
    };
    
    const currentSubnodes = Array.isArray(selectedNode.data.subnodes) ? selectedNode.data.subnodes : [];
    const updatedSubnodes = [...currentSubnodes, newSubnode];
    onUpdateNode(selectedNode.id, { subnodes: updatedSubnodes });
  };

  const handleRemoveNode = () => {
    // This would be handled by the parent component
    console.log("Remove node:", selectedNode.id);
  };

  return (
    <div className="w-80 border-l border-border bg-muted/50 p-4 overflow-y-auto">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-4">Node Properties</h3>
          
          <div className="space-y-4">
            <div>
              <Label>Label</Label>
              <p className="text-sm text-muted-foreground mt-1 p-2 bg-background border rounded">
                {String(selectedNode.data.label || "No label")}
              </p>
            </div>

            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground mt-1 p-2 bg-background border rounded min-h-16">
                {String(selectedNode.data.description || "No description")}
              </p>
            </div>

            <div>
              <Label>Total Number of Subnodes</Label>
              <p className="text-sm text-muted-foreground mt-1 p-2 bg-background border rounded">
                {Array.isArray(selectedNode.data.subnodes) ? selectedNode.data.subnodes.length : 0}
              </p>
            </div>

            <div>
              <Label>Total Number of Parameters</Label>
              <p className="text-sm text-muted-foreground mt-1 p-2 bg-background border rounded">
                {selectedNode.data.parameters && typeof selectedNode.data.parameters === 'object' 
                  ? Object.keys(selectedNode.data.parameters).length 
                  : 0}
              </p>
            </div>

            <div>
              <Label htmlFor="subnodeSelect">Assign Subnode</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subnode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="subnode1">Data Validation Subnode</SelectItem>
                  <SelectItem value="subnode2">Data Transformation Subnode</SelectItem>
                  <SelectItem value="subnode3">Error Handling Subnode</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            variant="destructive" 
            size="sm" 
            className="w-full"
            onClick={handleRemoveNode}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Node
          </Button>
        </div>
      </div>
    </div>
  );
}