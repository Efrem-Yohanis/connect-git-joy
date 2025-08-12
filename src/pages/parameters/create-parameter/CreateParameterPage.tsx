import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save } from "lucide-react";
import { nodeService } from "@/services/nodeService";
import { useEffect } from "react";
import { parameterService } from "@/services/parameterService";
import { useToast } from "@/hooks/use-toast";

export function CreateParameterPage() {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<any[]>([]);
  const [nodesLoading, setNodesLoading] = useState(true);
  const [nodesError, setNodesError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const nodeList = await nodeService.getAllNodes();
        setNodes(nodeList);
      } catch (err: any) {
        setNodesError(err.message || 'Failed to fetch nodes');
      } finally {
        setNodesLoading(false);
      }
    };
    fetchNodes();
  }, []);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    key: "",
    default_value: "",
    required: true,
    datatype: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.key) {
      toast({
        title: "Validation Error",
        description: "Parameter key is required.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newParameter = await parameterService.createParameter({
        key: formData.key,
        default_value: formData.default_value,
        required: formData.required,
        datatype: formData.datatype || "string",
      });

      toast({
        title: "Parameter created successfully",
        description: `Parameter "${newParameter.key}" has been created.`,
      });

      navigate(`/parameters/${newParameter.id}`);
    } catch (error: any) {
      console.error('Error creating parameter:', error);
      toast({
        title: "Error creating parameter",
        description: error.response?.data?.detail || "Failed to create parameter. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (nodesLoading) {
    return <div className="flex items-center justify-center h-64">Loading nodes...</div>;
  }

  if (nodesError) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error loading nodes: {nodesError}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          onClick={() => navigate("/parameters")}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Parameters
        </Button>
        <h1 className="text-3xl font-bold">Create New Parameter</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Parameter Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="key">Parameter Key *</Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => handleInputChange("key", e.target.value)}
                  placeholder="e.g., timeout, threshold, batch_size"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="default_value">Default Value</Label>
                <Input
                  id="default_value"
                  value={formData.default_value}
                  onChange={(e) => handleInputChange("default_value", e.target.value)}
                  placeholder="e.g., 30, true, example_value"
                />
              </div>
            </div>


            <div className="space-y-2">
              <Label htmlFor="datatype">Data Type</Label>
              <Select 
                value={formData.datatype} 
                onValueChange={(value) => handleInputChange("datatype", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="integer">Integer</SelectItem>
                  <SelectItem value="float">Float</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="datetime">DateTime</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="file">File</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="required"
                checked={formData.required}
                onCheckedChange={(checked) => handleInputChange("required", checked)}
              />
              <Label htmlFor="required">Required Parameter</Label>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center space-x-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? "Creating..." : "Create Parameter"}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/parameters")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}