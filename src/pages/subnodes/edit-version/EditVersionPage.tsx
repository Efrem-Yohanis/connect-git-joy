import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { subnodeService, VersionDetail, ParameterValue } from "@/services/subnodeService";

export function EditVersionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const version = searchParams.get('version');
  
  const [versionDetail, setVersionDetail] = useState<VersionDetail | null>(null);
  const [parameterValues, setParameterValues] = useState<ParameterValue[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadVersionDetail = async () => {
      if (!id || !version) {
        toast.error("Missing subnode ID or version parameter");
        navigate(`/subnodes/${id || ''}`);
        return;
      }
      
      const versionNumber = parseInt(version);
      if (isNaN(versionNumber)) {
        toast.error("Invalid version parameter");
        navigate(`/subnodes/${id}`);
        return;
      }
      
      try {
        setLoading(true);
        const detail = await subnodeService.getVersionDetail(id, versionNumber);
        setVersionDetail(detail);
        setParameterValues(detail.parameter_values);
      } catch (error) {
        toast.error("Failed to load version details");
        console.error("Load version error:", error);
        navigate(`/subnodes/${id}`);
      } finally {
        setLoading(false);
      }
    };

    loadVersionDetail();
  }, [id, version, navigate]);

  const handleParameterValueChange = (paramId: string, value: string) => {
    setParameterValues(prev => 
      prev.map(param => 
        param.id === paramId ? { ...param, value } : param
      )
    );
  };

  const handleSave = async () => {
    if (!versionDetail) return;
    
    setSaving(true);
    try {
      const updateData = {
        parameter_values: parameterValues.map(pv => ({
          id: pv.id,
          value: pv.value
        }))
      };
      
      await subnodeService.updateParameterValues(versionDetail.id, updateData);
      toast.success("Parameter values updated successfully");
      navigate(`/subnodes/${id}`);
    } catch (error) {
      toast.error("Failed to update parameter values");
      console.error("Update error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/subnodes/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading version details...</p>
        </div>
      </div>
    );
  }

  if (!versionDetail) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Version not found</p>
          <Button onClick={handleCancel}>Go Back</Button>
        </div>
      </div>
    );
  }

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
            <h1 className="text-3xl font-bold">Edit Parameter Values</h1>
            <p className="text-muted-foreground">
              Editing parameter values for {versionDetail.name} v{versionDetail.version}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={versionDetail.is_deployed ? "default" : "secondary"}>
            {versionDetail.is_deployed ? "Deployed" : "Not Deployed"}
          </Badge>
          <Badge variant={versionDetail.is_editable ? "outline" : "secondary"}>
            {versionDetail.is_editable ? "Editable" : "Read Only"}
          </Badge>
        </div>
      </div>

      {/* Subnode Information */}
      <Card>
        <CardHeader>
          <CardTitle>Subnode Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <p className="text-sm text-muted-foreground">{versionDetail.name}</p>
            </div>
            <div>
              <Label>Version</Label>
              <p className="text-sm text-muted-foreground">v{versionDetail.version}</p>
            </div>
            <div>
              <Label>Node ID</Label>
              <p className="text-sm text-muted-foreground">{versionDetail.node}</p>
            </div>
            <div>
              <Label>Version Comment</Label>
              <p className="text-sm text-muted-foreground">
                {versionDetail.version_comment || "No comment"}
              </p>
            </div>
          </div>
          {versionDetail.description && (
            <div>
              <Label>Description</Label>
              <p className="text-sm text-muted-foreground">{versionDetail.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Parameter Values */}
      <Card>
        <CardHeader>
          <CardTitle>Parameter Values</CardTitle>
        </CardHeader>
        <CardContent>
          {parameterValues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No parameters defined for this subnode.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter Key</TableHead>
                  <TableHead>Current Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parameterValues.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-medium">
                      {param.parameter_key}
                    </TableCell>
                    <TableCell>
                      <Input
                        value={param.value}
                        onChange={(e) => handleParameterValueChange(param.id, e.target.value)}
                        placeholder="Enter value"
                        disabled={!versionDetail.is_editable}
                      />
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
        <Button 
          onClick={handleSave} 
          disabled={!versionDetail.is_editable || saving}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}