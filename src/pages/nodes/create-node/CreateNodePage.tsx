
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";

export function CreateNodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [mediationType, setMediationType] = useState("");
  const [nodeType, setNodeType] = useState("");
  const [hasSubnodes, setHasSubnodes] = useState(false);
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

    if (!nodeDescription.trim()) {
      toast({
        title: "Error",
        description: "Description is required",
        variant: "destructive"
      });
      return;
    }

    if (!mediationType) {
      toast({
        title: "Error",
        description: "Mediation type is required",
        variant: "destructive"
      });
      return;
    }

    if (!nodeType) {
      toast({
        title: "Error",
        description: "Node type is required",
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
      // Step 1: Create Node Family
      const newNodeFamily = await nodeService.createNodeFamily({
        name: nodeName,
        description: nodeDescription,
        created_by: "Efrem"
      });

      // Step 2: Create Initial Version (v1)
      await nodeService.createNodeVersion(newNodeFamily.id, {
        version: 1,
        changelog: "initial version"
      });

      // Step 3: Upload Script for v1
      await nodeService.uploadVersionScript(newNodeFamily.id, 1, scriptFile);

      toast({
        title: "Success",
        description: "Node created and script uploaded."
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
            <Label htmlFor="nodeDescription">Description *</Label>
            <Textarea
              id="nodeDescription"
              value={nodeDescription}
              onChange={(e) => setNodeDescription(e.target.value)}
              placeholder="Enter node description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mediationType">Mediation Type *</Label>
              <Select value={mediationType} onValueChange={setMediationType}>
                <SelectTrigger id="mediationType">
                  <SelectValue placeholder="Select mediation type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charging">Charging</SelectItem>
                  <SelectItem value="convergent">Convergent Billing</SelectItem>
                  <SelectItem value="ncc">Network Call Control</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="nodeType">Node Type *</Label>
              <Select value={nodeType} onValueChange={setNodeType}>
                <SelectTrigger id="nodeType">
                  <SelectValue placeholder="Select node type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="collector">Collector</SelectItem>
                  <SelectItem value="decoder">Decoder</SelectItem>
                  <SelectItem value="encoder">Encoder</SelectItem>
                  <SelectItem value="enrichment">Enrichment</SelectItem>
                  <SelectItem value="validation">Validation</SelectItem>
                  <SelectItem value="fdc">FDC</SelectItem>
                  <SelectItem value="interface">Interface</SelectItem>
                  <SelectItem value="backup">Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Label htmlFor="hasSubnodes">Subnode</Label>
              <p className="text-sm text-muted-foreground">Enable if this node requires subnodes</p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="hasSubnodes" className="text-sm">
                {hasSubnodes ? "Yes" : "No"}
              </Label>
              <Switch
                id="hasSubnodes"
                checked={hasSubnodes}
                onCheckedChange={setHasSubnodes}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="scriptFile">Script File * (Python file)</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="scriptFile"
                type="file"
                accept=".py"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            {scriptFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Selected: {scriptFile.name}
              </p>
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
