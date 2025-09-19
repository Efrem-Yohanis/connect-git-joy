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
    node_family: "",
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

    if (!formData.node_family) {
      toast({
        title: "Validation Error",
        description: "Please select a parent node",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const newSubnode = await subnodeService.createSubnode({
        name: formData.name,
        description: formData.description,
        node_family: formData.node_family
      });
      
      toast({
        title: "Success",
        description: "Subnode created successfully"
      });
      
      // Navigate to subnodes list page, since we don't have the full subnode detail from create response
      navigate('/subnodes');
    } catch (error: any) {
      console.error("Create subnode error:", error);
      toast({
        title: "Error", 
        description: error.response?.data?.detail || error.response?.data?.error || "Failed to create subnode",
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
    <div className="w-full space-y-6">
      {/* Subnode Information */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Subnode</CardTitle>
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
                value={formData.node_family}
                onValueChange={(value) => handleInputChange('node_family', value)}
                disabled={nodesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder={nodesLoading ? "Loading nodes..." : "Select a parent node"} />
                </SelectTrigger>
                <SelectContent>
                  {nodes?.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.name} | {node.mediation_type || 'N/A'}
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
          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.node_family || isSubmitting || nodesLoading}
            >
              {isSubmitting ? "Creating..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Back Button */}
      <div className="flex justify-center">
        <Button variant="ghost" onClick={() => navigate("/devtool")}>
          Back to DevTool
        </Button>
      </div>
    </div>
  );
}