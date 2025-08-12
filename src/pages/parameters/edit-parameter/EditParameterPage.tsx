import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useParameter, parameterService } from "@/services/parameterService";
import { useToast } from "@/hooks/use-toast";

export function EditParameterPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: parameter, loading, error } = useParameter(id!);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    key: "",
    default_value: "",
    datatype: ""
  });

  // Load parameter data when parameter is fetched
  useEffect(() => {
    if (parameter) {
      setFormData({
        key: parameter.key,
        default_value: parameter.default_value,
        datatype: parameter.datatype
      });
    }
  }, [parameter]);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading parameter...</div>;
  }

  if (error || !parameter) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error || 'Parameter not found'}</div>;
  }

  if (parameter.is_active) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Cannot edit a deployed parameter. Undeploy first.
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.key.trim()) {
      toast({
        title: "Validation Error",
        description: "Parameter key is required",
        variant: "destructive",
      });
      return;
    }

    if (!formData.default_value.trim()) {
      toast({
        title: "Validation Error",
        description: "Default value is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await parameterService.updateParameter(parameter.id, {
        key: formData.key,
        default_value: formData.default_value,
        datatype: formData.datatype,
        required: parameter.required
      });
      
      toast({
        title: "Parameter updated successfully",
        description: "The parameter has been saved.",
      });
      navigate('/parameters');
    } catch (error) {
      toast({
        title: "Error updating parameter",
        description: "Failed to update the parameter. Please try again.",
        variant: "destructive",
      });
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
              value={formData.default_value}
              onChange={(e) => handleInputChange('default_value', e.target.value)}
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