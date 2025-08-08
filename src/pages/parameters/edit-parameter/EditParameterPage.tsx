import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

// Mock data - would be replaced with actual API calls
const mockParameter = {
  id: "1",
  key: "threshold",
  defaultValue: "10",
  parentNode: "User Data Processor",
  nodeId: "1",
  valueType: "int",
  updatedBy: "John Doe",
  updatedAt: "2024-01-15",
  nodeStatus: "deployed"
};

export function EditParameterPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    key: "",
    defaultValue: "",
    datatype: ""
  });

  // Load parameter data on mount
  useEffect(() => {
    // In a real app, this would fetch the parameter by ID
    if (id) {
      setFormData({
        key: mockParameter.key,
        defaultValue: mockParameter.defaultValue,
        datatype: mockParameter.valueType
      });
    }
  }, [id]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.key.trim()) {
      toast.error("Parameter key is required");
      return;
    }

    if (!formData.defaultValue.trim()) {
      toast.error("Default value is required");
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast.success("Parameter updated successfully!");
      navigate('/parameters');
    } catch (error) {
      toast.error("Failed to update parameter");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/parameters');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/parameters')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Parameters
        </Button>
        <h1 className="text-2xl font-bold">Edit Parameter</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parameter Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="parameterKey">Parameter Key *</Label>
            <Input
              id="parameterKey"
              value={formData.key}
              onChange={(e) => handleInputChange('key', e.target.value)}
              placeholder="Enter parameter key"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="defaultValue">Default Value *</Label>
            <Input
              id="defaultValue"
              value={formData.defaultValue}
              onChange={(e) => handleInputChange('defaultValue', e.target.value)}
              placeholder="Enter default value"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="datatype">Data Type</Label>
            <Select 
              value={formData.datatype} 
              onValueChange={(value) => handleInputChange('datatype', value)}
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              variant="outline" 
              onClick={handleCancel}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={isLoading}
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? "Saving..." : "Save Parameter"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}