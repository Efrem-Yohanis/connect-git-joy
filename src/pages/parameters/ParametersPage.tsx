import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Download, Settings, Trash2, Eye, Edit, Grid2X2, List, Copy } from "lucide-react";
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
import { useParameters, parameterService } from "@/services/parameterService";
import { useToast } from "@/hooks/use-toast";

export function ParametersPage() {
  const navigate = useNavigate();
  const { data: parameters, loading, error, refetch } = useParameters();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const { toast } = useToast();

  const filteredParameters = parameters.filter(param =>
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

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const importedParam = await parameterService.importParameter(file);
      toast({
        title: "Parameter imported successfully",
        description: `Parameter ${importedParam.key} has been imported.`,
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error importing parameter",
        description: "Failed to import the parameter. Please try again.",
        variant: "destructive",
      });
    }
    // Reset the input
    event.target.value = '';
  };

  const handleDelete = async (paramId: string) => {
    try {
      await parameterService.deleteParameter(paramId);
      toast({
        title: "Parameter deleted successfully",
        description: "The parameter has been removed.",
      });
      refetch();
    } catch (error) {
      toast({
        title: "Error deleting parameter",
        description: "Failed to delete the parameter. Please try again.",
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
              <Plus className="h-4 w-4 mr-2" />
              Import
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
            Create New Parameter
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
                  <Badge variant="outline" className="text-xs">
                    {param.required ? 'Required' : 'Optional'}
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
                
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium text-foreground mb-2">Actions:</div>
                  <div className="flex gap-2 flex-wrap">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/parameters/${param.id}`)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleExport(param.id)}
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Export
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleClone(param)}
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Clone
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDelete(param.id)}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
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
                <TableHead>Required</TableHead>
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
                    <Badge variant={param.required ? "default" : "secondary"}>
                      {param.required ? "Required" : "Optional"}
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
    </div>
  );
}