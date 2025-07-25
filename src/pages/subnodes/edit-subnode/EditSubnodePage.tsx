import { useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data - in real app, this would come from API
const mockSubnode = {
  id: "1",
  name: "Data Validation Subnode",
  scriptName: "validate_data.py",
  parentNode: "User Data Processor",
  parentNodeId: "1",
  isDeployed: true,
  version: "v1",
  parameters: [
    { 
      id: "1", 
      nodeParameterKey: "threshold", 
      nodeParameterType: "int", 
      value: "15"
    },
    { 
      id: "2", 
      nodeParameterKey: "tag_prefix", 
      nodeParameterType: "string", 
      value: "validated_"
    },
    { 
      id: "3", 
      nodeParameterKey: "enabled", 
      nodeParameterType: "boolean", 
      value: "true"
    },
  ]
};

const mockAvailableNodes = [
  { id: "1", name: "User Data Processor" },
  { id: "2", name: "Email Validator" },
  { id: "3", name: "Payment Processor" },
];

const mockNodeParameters = [
  { key: "threshold", type: "int" },
  { key: "tag_prefix", type: "string" },
  { key: "enabled", type: "boolean" },
  { key: "max_retries", type: "int" },
  { key: "timeout", type: "float" },
];

interface SubnodeParameter {
  id: string;
  nodeParameterKey: string;
  nodeParameterType: string;
  value: string;
}

export function EditSubnodePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  
  const isNewVersion = searchParams.get('version') === 'new';
  
  const [formData, setFormData] = useState({
    name: mockSubnode.name + (isNewVersion ? ' (v2)' : ''),
    scriptName: mockSubnode.scriptName,
    parentNodeId: mockSubnode.parentNodeId,
  });
  
  const [parameters, setParameters] = useState<SubnodeParameter[]>(mockSubnode.parameters);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParameterChange = (paramId: string, field: string, value: string) => {
    setParameters(prev => 
      prev.map(param => 
        param.id === paramId ? { ...param, [field]: value } : param
      )
    );
  };

  const addParameter = () => {
    const newParam: SubnodeParameter = {
      id: `param_${Date.now()}`,
      nodeParameterKey: "",
      nodeParameterType: "string",
      value: ""
    };
    setParameters(prev => [...prev, newParam]);
  };

  const removeParameter = (paramId: string) => {
    setParameters(prev => prev.filter(param => param.id !== paramId));
  };

  const handleSave = () => {
    // Validate form
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Subnode name is required",
        variant: "destructive"
      });
      return;
    }

    // Validate parameters
    for (const param of parameters) {
      if (!param.nodeParameterKey || !param.value) {
        toast({
          title: "Validation Error", 
          description: "All parameters must have a key and value",
          variant: "destructive"
        });
        return;
      }
    }

    // In real app, this would be an API call
    console.log('Saving subnode:', { formData, parameters });
    
    toast({
      title: "Success",
      description: isNewVersion 
        ? "New subnode version created successfully" 
        : "Subnode updated successfully"
    });
    
    navigate(`/subnodes/${id}`);
  };

  const handleCancel = () => {
    navigate(`/subnodes/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isNewVersion ? 'Create New Version' : 'Edit Subnode'}
            </h1>
            <p className="text-muted-foreground">
              {isNewVersion 
                ? `Creating a new version of ${mockSubnode.name}` 
                : `Editing ${mockSubnode.name}`
              }
            </p>
          </div>
        </div>
        
        {isNewVersion && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            New Version
          </Badge>
        )}
      </div>

      {/* Subnode Information */}
      <Card>
        <CardHeader>
          <CardTitle>Subnode Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Subnode Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter subnode name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentNode">Parent Node *</Label>
            <Select 
              value={formData.parentNodeId}
              onValueChange={(value) => handleInputChange('parentNodeId', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent node" />
              </SelectTrigger>
              <SelectContent>
                {mockAvailableNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Parameters Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Subnode Parameters</CardTitle>
            <Button variant="outline" size="sm" onClick={addParameter}>
              <Plus className="h-4 w-4 mr-2" />
              Add Parameter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {parameters.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No parameters added yet. Click "Add Parameter" to get started.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Node Parameter</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameters.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell>
                      <Select 
                        value={param.nodeParameterKey}
                        onValueChange={(value) => {
                          const selectedParam = mockNodeParameters.find(p => p.key === value);
                          handleParameterChange(param.id, 'nodeParameterKey', value);
                          if (selectedParam) {
                            handleParameterChange(param.id, 'nodeParameterType', selectedParam.type);
                          }
                        }}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select parameter" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockNodeParameters.map((nodeParam) => (
                            <SelectItem key={nodeParam.key} value={nodeParam.key}>
                              {nodeParam.key} ({nodeParam.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{param.nodeParameterType}</Badge>
                    </TableCell>
                    <TableCell>
                      {param.nodeParameterType === 'boolean' ? (
                        <Select 
                          value={param.value}
                          onValueChange={(value) => handleParameterChange(param.id, 'value', value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">true</SelectItem>
                            <SelectItem value="false">false</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={param.value}
                          onChange={(e) => handleParameterChange(param.id, 'value', e.target.value)}
                          placeholder="Enter value"
                          type={param.nodeParameterType === 'int' || param.nodeParameterType === 'float' ? 'number' : 'text'}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeParameter(param.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          {isNewVersion ? 'Create New Version' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}