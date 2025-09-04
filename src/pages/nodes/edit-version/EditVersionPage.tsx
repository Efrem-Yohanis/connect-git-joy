import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, Search, Upload, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type NodeVersionDetail } from "@/services/nodeService";
import { parameterService, type Parameter } from "@/services/parameterService";
import { LoadingSpinner } from "@/components/ui/loading";

export function EditVersionPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const version = searchParams.get('version') || '1';
  
  const [nodeVersion, setNodeVersion] = useState<NodeVersionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Parameters management
  const [availableParameters, setAvailableParameters] = useState<Parameter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedParametersToAdd, setSelectedParametersToAdd] = useState<string[]>([]);
  
  // Script management
  const [scriptFile, setScriptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [versionData, parametersData] = await Promise.all([
          nodeService.getNodeVersionDetail(id, parseInt(version)),
          parameterService.getParameters()
        ]);
        
        setNodeVersion(versionData);
        setAvailableParameters(parametersData);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        toast({
          title: "Error",
          description: "Failed to load node version data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, version, toast]);

  const filteredAvailableParameters = availableParameters.filter(param =>
    !nodeVersion?.parameters.some(np => np.parameter_id === param.id) &&
    (param.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
     param.datatype.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredAvailableParameters.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedAvailableParameters = filteredAvailableParameters.slice(startIndex, startIndex + pageSize);

  const handleAddParameters = async () => {
    if (!id || selectedParametersToAdd.length === 0) return;
    
    try {
      setSaving(true);
      await nodeService.addParametersToVersion(id, parseInt(version), selectedParametersToAdd);
      
      // Refresh node version data
      const updatedVersion = await nodeService.getNodeVersionDetail(id, parseInt(version));
      setNodeVersion(updatedVersion);
      setSelectedParametersToAdd([]);
      
      toast({
        title: "Parameters Added",
        description: `${selectedParametersToAdd.length} parameters added successfully`,
      });
    } catch (err: any) {
      console.error("Error adding parameters:", err);
      toast({
        title: "Error",
        description: "Failed to add parameters",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveParameter = async (parameterId: string) => {
    if (!id) return;
    
    const confirmDelete = window.confirm("Are you sure you want to remove this parameter?");
    if (!confirmDelete) return;
    
    try {
      setSaving(true);
      await nodeService.removeParametersFromVersion(id, parseInt(version), [parameterId]);
      
      // Refresh node version data
      const updatedVersion = await nodeService.getNodeVersionDetail(id, parseInt(version));
      setNodeVersion(updatedVersion);
      
      toast({
        title: "Parameter Removed",
        description: "Parameter removed successfully",
      });
    } catch (err: any) {
      console.error("Error removing parameter:", err);
      toast({
        title: "Error",
        description: "Failed to remove parameter",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleScriptUpload = async () => {
    if (!id || !scriptFile) return;
    
    try {
      setUploading(true);
      await nodeService.uploadVersionScript(id, parseInt(version), scriptFile);
      
      // Refresh node version data
      const updatedVersion = await nodeService.getNodeVersionDetail(id, parseInt(version));
      setNodeVersion(updatedVersion);
      setScriptFile(null);
      
      toast({
        title: "Script Updated",
        description: "Script uploaded successfully",
      });
    } catch (err: any) {
      console.error("Error uploading script:", err);
      toast({
        title: "Error",
        description: "Failed to upload script",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDownloadScript = async () => {
    if (!nodeVersion?.script_url) return;
    
    try {
      const response = await fetch(nodeVersion.script_url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${nodeVersion.family_name}_v${nodeVersion.version}.py`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to download script",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!nodeVersion) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">Node version not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Edit Node Version</h1>
          <p className="text-muted-foreground">Manage parameters and script for this version</p>
        </div>
      </div>

      {/* Node Information Card (Read-only) */}
      <Card>
        <CardHeader>
          <CardTitle>Node Information</CardTitle>
          <CardDescription>Version details (read-only)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Node Family</Label>
            <p className="text-base">{nodeVersion.family_name}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Node Version</Label>
            <p className="text-base">{nodeVersion.version}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">State</Label>
            <Badge variant={nodeVersion.state === 'published' ? 'default' : 'secondary'}>
              {nodeVersion.state}
            </Badge>
          </div>
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
            <p className="text-base">{new Date(nodeVersion.created_at).toLocaleDateString()}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-muted-foreground">Changelog</Label>
            <p className="text-base">{nodeVersion.changelog || 'No changelog available'}</p>
          </div>
          <div className="col-span-2">
            <Label className="text-sm font-medium text-muted-foreground">Script URL</Label>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                {nodeVersion.script_url || 'No script uploaded'}
              </code>
              {nodeVersion.script_url && (
                <Button variant="outline" size="sm" onClick={handleDownloadScript}>
                  <Download className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
        </TabsList>
        
        {/* Parameters Tab */}
        <TabsContent value="parameters" className="space-y-6">
          {/* Current Parameters Table */}
          <Card>
            <CardHeader>
              <CardTitle>Current Parameters ({nodeVersion.parameters.length})</CardTitle>
              <CardDescription>Parameters currently assigned to this version</CardDescription>
            </CardHeader>
            <CardContent>
              {nodeVersion.parameters.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Data Type</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nodeVersion.parameters.map((param) => (
                      <TableRow key={param.id}>
                        <TableCell className="font-medium">{param.key}</TableCell>
                        <TableCell>
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {param.value}
                          </code>
                        </TableCell>
                        <TableCell className="capitalize">{param.datatype}</TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleRemoveParameter(param.parameter_id)}
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No parameters assigned to this version</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Parameters Section */}
          <Card>
            <CardHeader>
              <CardTitle>Add Parameters</CardTitle>
              <CardDescription>Select parameters to add to this version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Controls */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search available parameters..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Show:</span>
                  <Select value={pageSize.toString()} onValueChange={(value) => {
                    setPageSize(parseInt(value));
                    setCurrentPage(1);
                  }}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Available Parameters Table */}
              {filteredAvailableParameters.length > 0 ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">Select</TableHead>
                        <TableHead>Key</TableHead>
                        <TableHead>Default Value</TableHead>
                        <TableHead>Data Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedAvailableParameters.map((param) => (
                        <TableRow key={param.id}>
                          <TableCell>
                            <input
                              type="checkbox"
                              checked={selectedParametersToAdd.includes(param.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedParametersToAdd([...selectedParametersToAdd, param.id]);
                                } else {
                                  setSelectedParametersToAdd(selectedParametersToAdd.filter(id => id !== param.id));
                                }
                              }}
                              className="h-4 w-4"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{param.key}</TableCell>
                          <TableCell>
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {param.default_value || "—"}
                            </code>
                          </TableCell>
                          <TableCell className="capitalize">{param.datatype}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredAvailableParameters.length)} of {filteredAvailableParameters.length} parameters
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          Previous
                        </button>
                        <span className="text-sm">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Add Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleAddParameters}
                      disabled={selectedParametersToAdd.length === 0 || saving}
                    >
                      Add Selected Parameters ({selectedParametersToAdd.length})
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchTerm ? "No available parameters match your search." : "All parameters are already assigned to this version."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Script Tab */}
        <TabsContent value="script" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Script Management</CardTitle>
              <CardDescription>Upload or download the Python script for this version</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Script</Label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded flex-1">
                    {nodeVersion.script_url || 'No script uploaded'}
                  </code>
                  {nodeVersion.script_url && (
                    <Button variant="outline" size="sm" onClick={handleDownloadScript}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Upload New Script</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept=".py"
                    onChange={(e) => setScriptFile(e.target.files?.[0] || null)}
                  />
                  <Button 
                    onClick={handleScriptUpload}
                    disabled={!scriptFile || uploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Only Python (.py) files are supported
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}