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

interface NodeParameter {
  id: string;
  key: string;
  valueType: string;
}

const mockExistingParameters = [
  { id: "1", key: "database_url", valueType: "String" },
  { id: "2", key: "timeout", valueType: "Integer" },
  { id: "3", key: "enable_cache", valueType: "Boolean" },
  { id: "4", key: "max_connections", valueType: "Integer" },
];

const mockActiveSubnodes = [
  { id: "1", name: "Data Validator" },
  { id: "2", name: "Email Processor" },
  { id: "3", name: "File Handler" },
  { id: "4", name: "API Connector" },
  { id: "5", name: "Cache Manager" },
];

export function CreateNodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nodeName, setNodeName] = useState("");
  const [nodeDescription, setNodeDescription] = useState("");
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [nodeParameters, setNodeParameters] = useState<NodeParameter[]>([]);
  const [selectedSubnodes, setSelectedSubnodes] = useState<string[]>([]);

  const addParameter = () => {
    const newParam: NodeParameter = {
      id: Date.now().toString(),
      key: "",
      valueType: "String"
    };
    setNodeParameters([...nodeParameters, newParam]);
  };

  const addExistingParameter = (existingParamId: string) => {
    const existingParam = mockExistingParameters.find(p => p.id === existingParamId);
    if (existingParam) {
      const newParam: NodeParameter = {
        id: Date.now().toString(),
        key: existingParam.key,
        valueType: existingParam.valueType
      };
      setNodeParameters([...nodeParameters, newParam]);
    }
  };

  const removeParameter = (id: string) => {
    setNodeParameters(nodeParameters.filter(p => p.id !== id));
  };

  const updateParameter = (id: string, field: keyof NodeParameter, value: string) => {
    setNodeParameters(nodeParameters.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const addSubnode = (subnodeId: string) => {
    if (!selectedSubnodes.includes(subnodeId)) {
      setSelectedSubnodes([...selectedSubnodes, subnodeId]);
    }
  };

  const removeSubnode = (subnodeId: string) => {
    setSelectedSubnodes(selectedSubnodes.filter(id => id !== subnodeId));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setScriptFile(file);
    }
  };

  const handleSave = () => {
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

    // Validate parameters
    for (const param of nodeParameters) {
      if (!param.key.trim()) {
        toast({
          title: "Error",
          description: "All parameter keys must be filled",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Node created successfully"
    });
    
    navigate("/nodes");
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
            <div className="flex items-center justify-between">
              <CardTitle>Node Parameters</CardTitle>
              <Select onValueChange={addExistingParameter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Attach existing parameter" />
                </SelectTrigger>
                <SelectContent>
                  {mockExistingParameters.map((param) => (
                    <SelectItem key={param.id} value={param.id}>
                      {param.key} ({param.valueType})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </CardHeader>
        <CardContent>
          {nodeParameters.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No parameters added yet</p>
          ) : (
            <div className="space-y-4">
              {nodeParameters.map((param) => (
                <div key={param.id} className="flex items-end gap-4 p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Key *</Label>
                    <Input
                      value={param.key}
                      onChange={(e) => updateParameter(param.id, 'key', e.target.value)}
                      placeholder="Parameter key"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Value Type *</Label>
                    <Select
                      value={param.valueType}
                      onValueChange={(value) => updateParameter(param.id, 'valueType', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="String">String</SelectItem>
                        <SelectItem value="Integer">Integer</SelectItem>
                        <SelectItem value="Boolean">Boolean</SelectItem>
                        <SelectItem value="Float">Float</SelectItem>
                      </SelectContent>
                    </Select>
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
          )}
        </CardContent>
      </Card>


      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Node
        </Button>
      </div>
    </div>
  );
}