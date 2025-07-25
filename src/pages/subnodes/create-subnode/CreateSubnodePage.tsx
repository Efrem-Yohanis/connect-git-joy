import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data
const mockAvailableNodes = [
  { 
    id: "1", 
    name: "User Data Processor",
    parameters: [
      { id: "1", key: "threshold", type: "int" },
      { id: "2", key: "tag_prefix", type: "string" },
      { id: "3", key: "enabled", type: "boolean" },
    ]
  },
  { 
    id: "2", 
    name: "Email Validator",
    parameters: [
      { id: "4", key: "domain_whitelist", type: "string" },
      { id: "5", key: "strict_mode", type: "boolean" },
    ]
  },
  { 
    id: "3", 
    name: "Payment Processor",
    parameters: [
      { id: "6", key: "api_key", type: "string" },
      { id: "7", key: "timeout", type: "float" },
      { id: "8", key: "retry_count", type: "int" },
    ]
  },
];

interface ParameterValue {
  parameterId: string;
  parameterKey: string;
  parameterType: string;
  value: string;
}

export function CreateSubnodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    selectedNodeId: "",
  });
  
  const [parameterValues, setParameterValues] = useState<ParameterValue[]>([]);
  
  const selectedNode = mockAvailableNodes.find(node => node.id === formData.selectedNodeId);

  // Populate parameter values when node is selected
  useEffect(() => {
    if (selectedNode) {
      const newParameterValues = selectedNode.parameters.map(param => ({
        parameterId: param.id,
        parameterKey: param.key,
        parameterType: param.type,
        value: ""
      }));
      setParameterValues(newParameterValues);
    } else {
      setParameterValues([]);
    }
  }, [selectedNode]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleParameterValueChange = (parameterId: string, value: string) => {
    setParameterValues(prev => 
      prev.map(param => 
        param.parameterId === parameterId ? { ...param, value } : param
      )
    );
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

    if (!formData.selectedNodeId) {
      toast({
        title: "Validation Error",
        description: "Please select a parent node",
        variant: "destructive"
      });
      return;
    }

    // Validate parameter values
    for (const param of parameterValues) {
      if (!param.value.trim()) {
        toast({
          title: "Validation Error", 
          description: `Please provide a value for parameter: ${param.parameterKey}`,
          variant: "destructive"
        });
        return;
      }
    }

    // In real app, this would be an API call
    console.log('Creating subnode:', { formData, parameterValues });
    
    toast({
      title: "Success",
      description: "Subnode created successfully"
    });
    
    navigate('/subnodes');
  };

  const handleCancel = () => {
    navigate('/subnodes');
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
            <h1 className="text-3xl font-bold">Create New Subnode</h1>
            <p className="text-muted-foreground">
              Create a new subnode and configure its parameters
            </p>
          </div>
        </div>
      </div>

      {/* Subnode Information */}
      <Card>
        <CardHeader>
          <CardTitle>Subnode Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label htmlFor="parentNode">Select Parent Node *</Label>
              <Select 
                value={formData.selectedNodeId}
                onValueChange={(value) => handleInputChange('selectedNodeId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a parent node" />
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
          </div>

          {selectedNode && (
            <div className="space-y-2">
              <Label>Script Inheritance</Label>
              <p className="text-sm text-muted-foreground">
                Script will be inherited from parent node: <strong>{selectedNode.name}</strong>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parameter Configuration */}
      {selectedNode && parameterValues.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Parameter Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure values for parameters inherited from parent node
            </p>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter Key</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value *</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameterValues.map((param) => (
                  <TableRow key={param.parameterId}>
                    <TableCell className="font-medium">{param.parameterKey}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{param.parameterType}</Badge>
                    </TableCell>
                    <TableCell>
                      {param.parameterType === 'boolean' ? (
                        <Select 
                          value={param.value}
                          onValueChange={(value) => handleParameterValueChange(param.parameterId, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select value" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">true</SelectItem>
                            <SelectItem value="false">false</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={param.value}
                          onChange={(e) => handleParameterValueChange(param.parameterId, e.target.value)}
                          placeholder="Enter value"
                          type={param.parameterType === 'int' || param.parameterType === 'float' ? 'number' : 'text'}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {selectedNode && parameterValues.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              Selected node has no parameters to configure
            </p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!formData.selectedNodeId}>
          Create Subnode
        </Button>
      </div>
    </div>
  );
}