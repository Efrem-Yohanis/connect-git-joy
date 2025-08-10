
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { useParameters } from "@/services/parameterService";

export function CreateNodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: availableParameters, loading: parametersLoading } = useParameters();
  
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [selectedParameterIds, setSelectedParameterIds] = useState<string[]>([]);
  const [parameterFilter, setParameterFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredParameters = availableParameters.filter(param =>
    param.key.toLowerCase().includes(parameterFilter.toLowerCase()) &&
    !selectedParameterIds.includes(param.id)
  );

  const selectedParameters = availableParameters.filter(param => 
    selectedParameterIds.includes(param.id)
  );

  const addParameter = (parameterId: string) => {
    if (!selectedParameterIds.includes(parameterId)) {
      setSelectedParameterIds([...selectedParameterIds, parameterId]);
    }
  };

  const removeParameter = (parameterId: string) => {
    setSelectedParameterIds(selectedParameterIds.filter(id => id !== parameterId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScriptFile(file);
    }
  };

  const handleSave = async () => {
    if (!nodeName.trim()) {
      toast({
        title: "Error",
        description: "Node name is required",
        variant: "destructive"
      });
      return;
    }

    if (!scriptFile) {
      toast({
        title: "Error", 
        description: "Script file is required",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Create the node first
      const newNode = await nodeService.createNode({
        name: nodeName,
        description: nodeDescription,
        script: scriptFile
      });

      // Add parameters if any are selected
      if (selectedParameterIds.length > 0) {
        await nodeService.addParametersToNode(newNode.id, selectedParameterIds);
      }

      toast({
        title: "Success",
        description: "Node created successfully"
      });
      
      navigate("/nodes");
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to create node";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
      console.error("Create node error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/nodes");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Create New Node</h1>
      </div>

      {/* Node Information */}
      <Card>
        <CardHeader>
          <CardTitle>Node Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nodeName">Node Name *</Label>
            <Input
              id="nodeName"
              value={nodeName}
              onChange={(e) => setNodeName(e.target.value)}
              placeholder="Enter node name"
            />
          </div>

          <div>
            <Label htmlFor="nodeDescription">Description</Label>
            <Textarea
              id="nodeDescription"
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              placeholder="Enter node description"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="scriptFile">Script File *</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="scriptFile"
                type="file"
                accept=".py,.js,.sh,.bat"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <Button size="sm" variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
            </div>
            {scriptFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {scriptFile.name}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Node Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Node Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Parameter Selection */}
            <div className="flex gap-4">
              <div className="flex-1">
                <Label>Filter Parameters</Label>
                <Input
                  value={parameterFilter}
                  onChange={(e) => setParameterFilter(e.target.value)}
                  placeholder="Type to filter parameters..."
                />
              </div>
              <div className="flex-1">
                <Label>Select Parameter</Label>
                <Select onValueChange={addParameter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a parameter to add" />
                  </SelectTrigger>
                  <SelectContent>
                    {parametersLoading ? (
                      <SelectItem value="loading" disabled>Loading parameters...</SelectItem>
                    ) : filteredParameters.length === 0 ? (
                      <SelectItem value="no-results" disabled>
                        {parameterFilter ? "No parameters match filter" : "No parameters available"}
                      </SelectItem>
                    ) : (
                      filteredParameters.map((param) => (
                        <SelectItem key={param.id} value={param.id}>
                          {param.key} ({param.required ? 'Required' : 'Optional'})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Selected Parameters */}
            {selectedParameters.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No parameters selected</p>
            ) : (
              <div className="space-y-2">
                <Label>Selected Parameters</Label>
                <div className="space-y-2">
                  {selectedParameters.map((param) => (
                    <div key={param.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{param.key}</div>
                        <div className="text-sm text-muted-foreground">
                          Default: {param.default_value || 'None'} | {param.required ? 'Required' : 'Optional'}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeParameter(param.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? "Creating..." : "Save Node"}
        </Button>
      </div>
    </div>
  );
}
