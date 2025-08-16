import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Upload, Settings, Trash2, Eye, Edit, Grid2X2, List, Copy, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useParametersWithMetadata, parameterService } from "@/services/parameterService";
import { useToast } from "@/hooks/use-toast";
import { useSection } from "@/contexts/SectionContext";

export function ParametersPage() {
  const navigate = useNavigate();
  const { data: parametersResponse, loading, error, refetch } = useParametersWithMetadata();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { toast } = useToast();
  const { setCurrentSection, setStatusCounts } = useSection();
  
  // Import preview modal state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Extract parameters array from response
  const parameters = parametersResponse.results || [];

  // Update section context when data changes
  useEffect(() => {
    setCurrentSection("Parameters");
    setStatusCounts({
      total: parametersResponse.total,
      deployed: parametersResponse.published,
      drafted: parametersResponse.draft_count
    });
  }, [parametersResponse, setCurrentSection, setStatusCounts]);

  const filteredParameters = (Array.isArray(parameters) ? parameters : []).filter(param =>
    param.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading parameters...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center h-64 text-red-500">Error: {error}</div>;
  }

  const handleClone = async (param: any) => {
    try {
      const clonedParam = await parameterService.cloneParameter(param.id);
      toast({
        title: "Parameter cloned successfully",
        description: `Parameter ${clonedParam.key} has been created.`,
      });
      navigate(`/parameters/${clonedParam.id}/edit`);
    } catch (error) {
      toast({
        title: "Error cloning parameter",
        description: "Failed to clone the parameter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (paramId: string) => {
    try {
      const blob = await parameterService.exportParameter(paramId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parameter_${paramId}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({
        title: "Parameter exported successfully",
        description: "The parameter has been downloaded as JSON.",
      });
    } catch (error) {
      toast({
        title: "Error exporting parameter",
        description: "Failed to export the parameter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const validateParameterJSON = (jsonData: any): boolean => {
    const requiredFields = ['key', 'default_value', 'datatype'];
    return requiredFields.every(field => field in jsonData);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Read and validate JSON structure before showing preview
      const fileContent = await file.text();
      const jsonData = JSON.parse(fileContent);
      
      if (!validateParameterJSON(jsonData)) {
        toast({
          title: "Invalid JSON structure",
          description: "The JSON file must contain 'key', 'default_value', and 'datatype' fields.",
          variant: "destructive",
        });
        event.target.value = '';
        return;
      }

      // Extract preview data and show modal
      setPreviewData({
        key: jsonData.key,
        default_value: jsonData.default_value,
        datatype: jsonData.datatype
      });
      setSelectedFile(file);
      setShowPreviewModal(true);
      
    } catch (error: any) {
      let errorMessage = "Failed to read the parameter file. Please try again.";
      if (error.message?.includes("JSON")) {
        errorMessage = "Invalid JSON file format.";
      }
      toast({
        title: "Error reading file",
        description: errorMessage,
        variant: "destructive",
      });
    }
    // Reset the input
    event.target.value = '';
  };

  const confirmImport = async () => {
    if (!selectedFile) return;

    try {
      const importedParam = await parameterService.importParameter(selectedFile);
      toast({
        title: "Parameter imported successfully",
        description: `Parameter ${importedParam.key} has been imported.`,
      });
      refetch();
      setShowPreviewModal(false);
      setSelectedFile(null);
      setPreviewData(null);
    } catch (error: any) {
      toast({
        title: "Error importing parameter",
        description: "Failed to import the parameter. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (paramId: string) => {
    try {
      await parameterService.deleteParameter(paramId);
      toast({
        title: "Parameter deleted successfully",
        description: "The parameter has been removed.",
      });
      refetch();
    } catch (error: any) {
      let errorMessage = "Failed to delete the parameter. Please try again.";
      if (error.response?.data?.detail?.includes("active/deployed")) {
        errorMessage = "Cannot delete an active/deployed parameter. Undeploy it first.";
      }
      toast({
        title: "Error deleting parameter",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search parameters..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex border border-border rounded-md">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" asChild>
            <label htmlFor="import-file" className="cursor-pointer">
              <Upload className="h-4 w-4" />
            </label>
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          <Button onClick={() => navigate("/parameters/new")}>
            <Plus className="h-4 w-4 mr-2" />
            NEW
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredParameters.map((param) => (
            <Card key={param.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  {param.key}
                  <Badge variant={param.is_active ? "default" : "secondary"} className="text-xs">
                    {param.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="text-muted-foreground">
                    <span className="font-medium">Default Value:</span> 
                    <span className="ml-1 font-mono">{param.default_value || 'None'}</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border flex justify-between items-center">
                  <div className="text-xs font-medium text-foreground">Actions:</div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-background border border-border shadow-lg z-50">
                      <DropdownMenuItem onClick={() => navigate(`/parameters/${param.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(param.id)}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleClone(param)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Clone
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(param.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Default Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredParameters.map((param) => (
                <TableRow key={param.id}>
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 font-medium"
                      onClick={() => navigate(`/parameters/${param.id}`)}
                    >
                      {param.key}
                    </Button>
                  </TableCell>
                  <TableCell>{param.default_value}</TableCell>
                  <TableCell>
                    <Badge variant={param.is_active ? "default" : "secondary"}>
                      {param.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/parameters/${param.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleExport(param.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleClone(param)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(param.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Import Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Import Parameter Preview</DialogTitle>
            <DialogDescription>
              Review the parameter details before importing.
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Key</label>
                  <div className="mt-1 p-2 bg-muted rounded border text-sm font-mono">
                    {previewData.key}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Data Type</label>
                  <div className="mt-1 p-2 bg-muted rounded border text-sm">
                    {previewData.datatype}
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Default Value</label>
                <div className="mt-1 p-2 bg-muted rounded border text-sm font-mono">
                  {previewData.default_value}
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmImport}>
              Import Parameter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}