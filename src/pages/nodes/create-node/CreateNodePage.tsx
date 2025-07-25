import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

interface NodeSubnode {
  id: string;
  name: string;
  availableSubnodeId: string;
}

const mockAvailableSubnodes = [
  { id: "1", name: "Data Validator" },
  { id: "2", name: "Email Processor" },
  { id: "3", name: "File Handler" },
  { id: "4", name: "API Connector" },
];

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

export function CreateNodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [nodeName, setNodeName] = useState("");
  const [scriptName, setScriptName] = useState("");
  const [executableScript, setExecutableScript] = useState("");
  const [useScriptName, setUseScriptName] = useState(true);
  const [nodeParameters, setNodeParameters] = useState<NodeParameter[]>([]);
  const [subNodes, setSubNodes] = useState<SubNode[]>([]);

  const addParameter = () => {
    const newParam: NodeParameter = {
      id: Date.now().toString(),
      key: "",
      valueType: "String"
    };
    setNodeParameters([...nodeParameters, newParam]);
  };

  const removeParameter = (id: string) => {
    setNodeParameters(nodeParameters.filter(p => p.id !== id));
    // Remove parameter from all subnodes
    setSubNodes(subNodes.map(subnode => ({
      ...subnode,
      parameters: subnode.parameters.filter(p => p.nodeParameterId !== id)
    })));
  };

  const updateParameter = (id: string, field: keyof NodeParameter, value: string) => {
    setNodeParameters(nodeParameters.map(p => 
      p.id === id ? { ...p, [field]: value } : p
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

  const removeSubNode = (id: string) => {
    setSubNodes(subNodes.filter(s => s.id !== id));
  };

  const updateSubNode = (id: string, field: keyof Omit<SubNode, 'parameters'>, value: string | boolean) => {
    setSubNodes(subNodes.map(s => 
      s.id === id ? { ...s, [field]: value } : s
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

          <div className="flex items-center space-x-2">
            <Switch 
              checked={useScriptName}
              onCheckedChange={setUseScriptName}
            />
            <Label>Use Script Name (toggle for Executable Script)</Label>
          </div>

          {useScriptName ? (
            <div>
              <Label htmlFor="scriptName">Script Name</Label>
              <Input
                id="scriptName"
                value={scriptName}
                onChange={(e) => setScriptName(e.target.value)}
                placeholder="Reference to saved script"
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="executableScript">Executable Script *</Label>
              <Textarea
                id="executableScript"
                value={executableScript}
                onChange={(e) => setExecutableScript(e.target.value)}
                placeholder="Enter the script to be executed"
                rows={6}
              />
            </div>
          )}
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
            <CardTitle>SubNodes (Optional)</CardTitle>
            <Button onClick={addSubNode} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add SubNode
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {subNodes.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No subnodes added yet</p>
          ) : (
            <div className="space-y-6">
              {subNodes.map((subnode) => (
                <div key={subnode.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">SubNode Configuration</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSubNode(subnode.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>SubNode Name *</Label>
                      <Input
                        value={subnode.name}
                        onChange={(e) => updateSubNode(subnode.id, 'name', e.target.value)}
                        placeholder="SubNode name"
                      />
                    </div>
                    <div>
                      <Label>Script Name</Label>
                      <Input
                        value={subnode.scriptName}
                        onChange={(e) => updateSubNode(subnode.id, 'scriptName', e.target.value)}
                        placeholder="Script reference (optional)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={subnode.isDeployed}
                      onCheckedChange={(checked) => updateSubNode(subnode.id, 'isDeployed', checked as boolean)}
                    />
                    <Label>Is Deployed</Label>
                  </div>

                  {/* SubNode Parameters */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="font-semibold">SubNode Parameters</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => addSubNodeParameter(subnode.id)}
                        disabled={nodeParameters.length === 0}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Parameter
                      </Button>
                    </div>
                    
                    {nodeParameters.length === 0 ? (
                      <p className="text-sm text-muted-foreground">Add node parameters first to link them here</p>
                    ) : subnode.parameters.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No parameters linked yet</p>
                    ) : (
                      <div className="space-y-2">
                        {subnode.parameters.map((param) => (
                          <div key={param.id} className="flex items-center space-x-4 p-2 bg-muted/50 rounded">
                            <div className="flex-1">
                              <Label className="text-sm">Node Parameter</Label>
                              <Select
                                value={param.nodeParameterId}
                                onValueChange={(value) => updateSubNodeParameter(subnode.id, param.id, 'nodeParameterId', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select parameter" />
                                </SelectTrigger>
                                <SelectContent>
                                  {nodeParameters.map((nodeParam) => (
                                    <SelectItem key={nodeParam.id} value={nodeParam.id}>
                                      {nodeParam.key} ({nodeParam.valueType})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex-1">
                              <Label className="text-sm">Value</Label>
                              <Input
                                value={param.value}
                                onChange={(e) => updateSubNodeParameter(subnode.id, param.id, 'value', e.target.value)}
                                placeholder="Parameter value"
                              />
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSubNodeParameter(subnode.id, param.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
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