import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Search, Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { nodeService } from '@/services/nodeService';
import { parameterService } from '@/services/parameterService';

interface Parameter {
  id: string;
  parameter_id: string;
  key: string;
  value: string;
  datatype: string;
}

interface AvailableParameter {
  id: string;
  key: string;
  default_value: string;
  datatype: string;
  is_active: boolean;
}

interface ParameterManagementProps {
  familyId: string;
  version: number;
  parameters: Parameter[];
  onParametersChange: (parameters: Parameter[]) => void;
  isEditable?: boolean;
}

export function ParameterManagement({ 
  familyId, 
  version, 
  parameters, 
  onParametersChange,
  isEditable = true 
}: ParameterManagementProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [availableParameters, setAvailableParameters] = useState<AvailableParameter[]>([]);
  const [selectedParameterIds, setSelectedParameterIds] = useState<string[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter parameters based on search term
  const filteredParameters = parameters.filter(param =>
    param.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    param.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginate filtered parameters
  const totalPages = Math.ceil(filteredParameters.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentParameters = filteredParameters.slice(startIndex, endIndex);

  // Reset to first page when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, pageSize]);

  // Fetch available parameters for adding
  const fetchAvailableParameters = async () => {
    try {
      setLoading(true);
      const params = await parameterService.getParameters();
      // Filter out parameters that are already added
      const existingParameterIds = parameters.map(p => p.parameter_id);
      const available = params.filter(p => 
        p.is_active && !existingParameterIds.includes(p.id)
      );
      setAvailableParameters(available);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch available parameters",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddParameters = async () => {
    if (selectedParameterIds.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select parameters to add",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await nodeService.addParametersToVersion(familyId, version, selectedParameterIds);
      
      toast({
        title: "Success",
        description: response.status,
      });

      // Update the parameters list with the new version data
      if (response.version && response.version.parameters) {
        onParametersChange(response.version.parameters);
      }

      setSelectedParameterIds([]);
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add parameters",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveParameter = async (parameterId: string) => {
    try {
      setLoading(true);
      const response = await nodeService.removeParametersFromVersion(familyId, version, [parameterId]);
      
      toast({
        title: "Success",
        description: response.status,
      });

      // Update the parameters list with the new version data
      if (response.version && response.version.parameters) {
        onParametersChange(response.version.parameters);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to remove parameter",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleParameterSelection = (parameterId: string, checked: boolean) => {
    if (checked) {
      setSelectedParameterIds(prev => [...prev, parameterId]);
    } else {
      setSelectedParameterIds(prev => prev.filter(id => id !== parameterId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Parameters</CardTitle>
            <CardDescription>Manage parameters for this node version</CardDescription>
          </div>
          {isEditable && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={fetchAvailableParameters}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Parameters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Parameters</DialogTitle>
                  <DialogDescription>
                    Select parameters to add to this node version
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-4">Loading available parameters...</div>
                  ) : availableParameters.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      No available parameters to add
                    </div>
                  ) : (
                    <div className="max-h-96 overflow-y-auto">
                      <div className="space-y-2">
                        {availableParameters.map((param) => (
                          <div key={param.id} className="flex items-center space-x-3 p-2 border rounded">
                            <Checkbox
                              checked={selectedParameterIds.includes(param.id)}
                              onCheckedChange={(checked) => 
                                handleParameterSelection(param.id, checked as boolean)
                              }
                            />
                            <div className="flex-1">
                              <div className="font-medium">{param.key}</div>
                              <div className="text-sm text-muted-foreground">
                                Default: {param.default_value} | Type: {param.datatype}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsAddDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleAddParameters}
                      disabled={selectedParameterIds.length === 0 || loading}
                    >
                      Add Selected ({selectedParameterIds.length})
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search parameters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
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

        {/* Parameters Table */}
        {filteredParameters.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No parameters match your search.' : 'No parameters defined for this version.'}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Data Type</TableHead>
                  {isEditable && <TableHead className="w-20">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentParameters.map((param) => (
                  <TableRow key={param.id}>
                    <TableCell className="font-medium">{param.key}</TableCell>
                    <TableCell>{param.value}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{param.datatype}</Badge>
                    </TableCell>
                    {isEditable && (
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveParameter(param.parameter_id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredParameters.length)} of {filteredParameters.length} parameters
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}