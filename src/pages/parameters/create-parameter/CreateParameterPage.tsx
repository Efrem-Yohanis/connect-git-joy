import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Mock data for nodes
const mockNodes = [
  { id: "1", name: "Database Source" },
  { id: "2", name: "Data Transform" },
  { id: "3", name: "File Output" },
];

export function CreateParameterPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nodeId, setNodeId] = useState("");
  const [parameterKey, setParameterKey] = useState("");
  const [valueType, setValueType] = useState("");
  const [nodes, setNodes] = useState(mockNodes);

  const handleSave = () => {
    if (!nodeId) {
      toast({
        title: "Error",
        description: "Please select a node",
        variant: "destructive"
      });
      return;
    }

    if (!parameterKey.trim()) {
      toast({
        title: "Error",
        description: "Parameter key is required",
        variant: "destructive"
      });
      return;
    }

    if (!valueType) {
      toast({
        title: "Error",
        description: "Please select a value type",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Parameter created successfully"
    });
    
    navigate("/parameters");
  };

  const handleCancel = () => {
    navigate("/parameters");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Parameter</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parameter Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="node">Node *</Label>
            <Select value={nodeId} onValueChange={setNodeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a node" />
              </SelectTrigger>
              <SelectContent>
                {nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="key">Key *</Label>
            <Input
              id="key"
              value={parameterKey}
              onChange={(e) => setParameterKey(e.target.value)}
              placeholder="Enter parameter key (e.g., timeout, database_url)"
            />
          </div>

          <div>
            <Label htmlFor="valueType">Value Type *</Label>
            <Select value={valueType} onValueChange={setValueType}>
              <SelectTrigger>
                <SelectValue placeholder="Select value type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="String">String</SelectItem>
                <SelectItem value="Integer">Integer</SelectItem>
                <SelectItem value="Boolean">Boolean</SelectItem>
                <SelectItem value="Float">Float</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Create Parameter
        </Button>
      </div>
    </div>
  );
}