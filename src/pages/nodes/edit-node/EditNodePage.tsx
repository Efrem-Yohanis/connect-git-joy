import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NodeParameter {
  id: string;
  key: string;
  valueType: string;
}

interface SubNodeParameter {
  id: string;
  nodeParameterId: string;
  value: string;
}

interface SubNode {
  id: string;
  name: string;
  scriptName: string;
  isDeployed: boolean;
  parameters: SubNodeParameter[];
}

// Mock existing node data
const mockNode = {
  id: "1",
  name: "Database Source",
  scriptName: "db_source.py",
  executableScript: "",
  useScriptName: true,
  parameters: [
    { id: "1", key: "timeout", valueType: "Integer" },
    { id: "2", key: "database_url", valueType: "String" }
  ],
  subNodes: [
    {
      id: "1",
      name: "Validation Subnode",
      scriptName: "validate.py",
      isDeployed: true,
      parameters: [
        { id: "1", nodeParameterId: "1", value: "30" },
        { id: "2", nodeParameterId: "2", value: "postgresql://localhost:5432/db" }
      ]
    }
  ]
};

export function EditNodePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nodeName, setNodeName] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [executableScript, setExecutableScript] = useState("");
  const [useScriptName, setUseScriptName] = useState(true);
  const [nodeParameters, setNodeParameters] = useState<NodeParameter[]>([]);
  const [subNodes, setSubNodes] = useState<SubNode[]>([]);

  useEffect(() => {
    // Load existing node data
    const node = mockNode; // In real app, fetch from API
    setNodeName(node.name);
    setScriptName(node.scriptName);
    setExecutableScript(node.executableScript);
    setUseScriptName(node.useScriptName);
    setNodeParameters(node.parameters);
    setSubNodes(node.subNodes);
  }, [id]);

  const addParameter = () => {
    const newParam: NodeParameter = {
      id: Date.now().toString(),
      key: "",
      valueType: "String"
    };
    setNodeParameters([...nodeParameters, newParam]);
  };

  const removeParameter = (paramId: string) => {
    setNodeParameters(nodeParameters.filter(p => p.id !== paramId));
    // Remove parameter from all subnodes
    setSubNodes(subNodes.map(subnode => ({
      ...subnode,
      parameters: subnode.parameters.filter(p => p.nodeParameterId !== paramId)
    })));
  };

  const updateParameter = (paramId: string, field: keyof NodeParameter, value: string) => {
    setNodeParameters(nodeParameters.map(p => 
      p.id === paramId ? { ...p, [field]: value } : p
    ));
  };

  const addSubNode = () => {
    const newSubNode: SubNode = {
      id: Date.now().toString(),
      name: "",
      scriptName: "",
      isDeployed: false,
      parameters: []
    };
    setSubNodes([...subNodes, newSubNode]);
  };

  const removeSubNode = (subNodeId: string) => {
    setSubNodes(subNodes.filter(s => s.id !== subNodeId));
  };

  const updateSubNode = (subNodeId: string, field: keyof Omit<SubNode, 'parameters'>, value: string | boolean) => {
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId ? { ...s, [field]: value } : s
    ));
  };

  const addSubNodeParameter = (subNodeId: string) => {
    const newParam: SubNodeParameter = {
      id: Date.now().toString(),
      nodeParameterId: "",
      value: ""
    };
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId 
        ? { ...s, parameters: [...s.parameters, newParam] }
        : s
    ));
  };

  const removeSubNodeParameter = (subNodeId: string, paramId: string) => {
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId 
        ? { ...s, parameters: s.parameters.filter(p => p.id !== paramId) }
        : s
    ));
  };

  const updateSubNodeParameter = (subNodeId: string, paramId: string, field: keyof SubNodeParameter, value: string) => {
    setSubNodes(subNodes.map(s => 
      s.id === subNodeId 
        ? { 
            ...s, 
            parameters: s.parameters.map(p => 
              p.id === paramId ? { ...p, [field]: value } : p
            ) 
          }
        : s
    ));
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

    if (!useScriptName && !executableScript.trim()) {
      toast({
        title: "Error", 
        description: "Either script name or executable script is required",
        variant: "destructive"
      });
      return;
    }

    if (useScriptName && !scriptName.trim()) {
      toast({
        title: "Error",
        description: "Script name is required when using script reference",
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

    // Validate subnodes
    for (const subnode of subNodes) {
      if (!subnode.name.trim()) {
        toast({
          title: "Error",
          description: "All subnode names must be filled",
          variant: "destructive"
        });
        return;
      }
    }

    toast({
      title: "Success",
      description: "Node updated successfully"
    });
    
    navigate("/nodes");
  };

  const handleCancel = () => {
    navigate("/nodes");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Node</h1>
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

          <div className="space-y-4">
            <div>
              <Label htmlFor="scriptName">Script Name</Label>
              <Input
                id="scriptName"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
                placeholder="Reference to saved script"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Download existing script
                  const scriptContent = "# Sample script content\nprint('Hello, World!')";
                  const blob = new Blob([scriptContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = scriptName || 'script.py';
                  a.click();
                  URL.revokeObjectURL(url);
                }}
              >
                Download Current Script
              </Button>
              
              <input
                type="file"
                accept=".py,.js,.sh,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      // Handle file upload
                      console.log('File uploaded:', file.name);
                      setScriptName(file.name);
                    };
                    reader.readAsText(file);
                  }
                }}
                style={{ display: 'none' }}
                id="scriptUpload"
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => document.getElementById('scriptUpload')?.click()}
              >
                Upload New Script
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Node Parameters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Node Parameters</CardTitle>
            <Button onClick={addParameter} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {nodeParameters.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No parameters added yet</p>
          ) : (
            <div className="space-y-4">
              {nodeParameters.map((param) => (
                <div key={param.id} className="flex items-center space-x-4 p-4 border rounded-lg">
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

      {/* SubNodes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>SubNodes</CardTitle>
            <Button onClick={addSubNode} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New Subnode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subNodes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No subnodes added yet</p>
          ) : (
            <div className="space-y-4">
              {subNodes.map((subnode) => (
                <div key={subnode.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">{subnode.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {subnode.isDeployed ? "🟢 Deployed" : "🔴 Not Deployed"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSubNode(subnode.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
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
          Save Changes
        </Button>
      </div>
    </div>
  );
}