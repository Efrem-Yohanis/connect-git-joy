import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService } from "@/services/nodeService";
import { subnodeService } from "@/services/subnodeService";

export function CreateSubnodePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
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
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    selectedNodeId: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
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

    setIsSubmitting(true);
    try {
      await subnodeService.createSubnode({
        name: formData.name,
        description: formData.description,
        node: formData.selectedNodeId
      });
      
      toast({
        title: "Success",
        description: "Subnode created successfully"
      });
      
      navigate('/subnodes');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.detail || "Failed to create subnode",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
          {nodesError && (
            <div className="text-destructive text-sm mb-4">
              Error loading nodes: {nodesError}
            </div>
          )}
          
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
                disabled={nodesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={nodesLoading ? "Loading nodes..." : "Select a parent node"} />
                </SelectTrigger>
                <SelectContent>
                  {nodes?.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter subnode description"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          disabled={!formData.selectedNodeId || isSubmitting || nodesLoading}
        >
          {isSubmitting ? "Creating..." : "Create Subnode"}
        </Button>
      </div>
    </div>
  );
}