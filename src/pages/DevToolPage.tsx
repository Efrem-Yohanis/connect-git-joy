import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Plus,
  Upload,
  Download,
  Trash2,
  Copy,
  Settings,
  Workflow,
  Network,
  GitFork,
  Database,
  Grid3X3,
  List,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  ExternalLink,
  GitCommit,
  Activity,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useItems } from '@/pages/apis/ItemService';
import { deleteItem } from '@/pages/apis/ItemService';
import { CreateFlowDialog } from "@/pages/flows/create-flow-dialog";
import { CloneFlowDialog } from "@/pages/flows/clone-flow-dialog";
import { useSubnodes, subnodeService } from "@/services/subnodeService";
import { parameterService } from "@/services/parameterService";
import { LoadingCard } from "@/components/ui/loading";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";
import { gitService, type GitInfo } from "@/services/gitService";

export function DevToolPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<{[key: string]: number}>({
    flows: 1,
    nodes: 1,
    subnodes: 1,
    parameters: 1
  });
  const [itemsPerPage, setItemsPerPage] = useState<{[key: string]: number}>({
    flows: 10,
    nodes: 10,
    subnodes: 10,
    parameters: 10
  });
  
  // Flows state
  const { data: flowsData, loading: flowsLoading } = useItems();
  const [flows, setFlows] = useState<any[]>([]);
  const [showCreateFlowDialog, setShowCreateFlowDialog] = useState(false);
  const [showCloneFlowDialog, setShowCloneFlowDialog] = useState(false);
  const [flowToClone, setFlowToClone] = useState<any>(null);
  
  // Nodes state
  const [nodes, setNodes] = useState<any[]>([]);
  const [nodesLoading, setNodesLoading] = useState(true);
  
  // Subnodes state  
  const { data: subnodesData, loading: subnodesLoading, refetch: refetchSubnodes } = useSubnodes();
  
  // Parameters state
  const [parameters, setParameters] = useState<any[]>([]);
  const [parametersLoading, setParametersLoading] = useState(true);

  // Git state
  const [gitInfo, setGitInfo] = useState<GitInfo | null>(null);
  const [gitLoading, setGitLoading] = useState(false);

  // Helper functions
  const getPaginatedItems = (items: any[], category: string) => {
    const start = (currentPage[category] - 1) * itemsPerPage[category];
    const end = start + itemsPerPage[category];
    return items.slice(start, end);
  };

  const getTotalPages = (itemCount: number, category: string) => {
    return Math.ceil(itemCount / itemsPerPage[category]);
  };

  const handlePageChange = (category: string, page: number) => {
    setCurrentPage(prev => ({ ...prev, [category]: page }));
  };

  const handleItemsPerPageChange = (category: string, newItemsPerPage: number) => {
    setItemsPerPage(prev => ({ ...prev, [category]: newItemsPerPage }));
    setCurrentPage(prev => ({ ...prev, [category]: 1 })); // Reset to first page
  };

  // Flow handlers
  const handleDeleteFlow = async (flowId: string) => {
    try {
      await deleteItem(flowId);
      setFlows(flows.filter(flow => flow.id !== flowId));
      toast({
        title: "Success",
        description: "Flow deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flow",
        variant: "destructive"
      });
    }
  };

  const handleExportFlow = (flow: any) => {
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.name || 'flow'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCloneFlow = (flow: any) => {
    setFlowToClone(flow);
    setShowCloneFlowDialog(true);
  };

  // Node handlers
  const handleDeleteNode = async (nodeId: string) => {
    try {
      await deleteItem(nodeId);
      setNodes(nodes.filter(node => node.id !== nodeId));
      toast({
        title: "Success",
        description: "Node deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive"
      });
    }
  };

  const handleExportNode = (node: any) => {
    const dataStr = JSON.stringify(node, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name || 'node'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Subnode handlers
  const handleDeleteSubnode = async (subnodeId: string) => {
    try {
      await subnodeService.deleteSubnode(subnodeId);
      refetchSubnodes();
      toast({
        title: "Success",
        description: "Subnode deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subnode",
        variant: "destructive"
      });
    }
  };

  const handleExportSubnode = (subnode: any) => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name || 'subnode'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Parameter handlers
  const handleDeleteParameter = async (parameterId: string) => {
    try {
      await parameterService.deleteParameter(parameterId);
      setParameters(parameters.filter(param => param.id !== parameterId));
      toast({
        title: "Success",
        description: "Parameter deleted successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete parameter",
        variant: "destructive"
      });
    }
  };

  const handleExportParameter = (parameter: any) => {
    const dataStr = JSON.stringify(parameter, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${parameter.name || 'parameter'}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Git functions
  const fetchGitInfo = async () => {
    setGitLoading(true);
    try {
      const info = await gitService.getCurrentBranch();
      setGitInfo({ currentBranch: info, totalCommits: 0, recentCommits: [] });
    } catch (error) {
      console.error('Failed to fetch git info:', error);
      toast({
        title: "Error",
        description: "Failed to fetch git information",
        variant: "destructive"
      });
    } finally {
      setGitLoading(false);
    }
  };

  // Effects
  useEffect(() => {
    if (flowsData) {
      setFlows(flowsData);
    }
  }, [flowsData]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await axios.get('/api/nodes');
        setNodes(response.data || []);
      } catch (error) {
        console.error('Failed to fetch nodes:', error);
        setNodes([]);
      } finally {
        setNodesLoading(false);
      }
    };

    fetchNodes();
  }, []);

  useEffect(() => {
    const fetchParameters = async () => {
      try {
        const response = await parameterService.getParameters();
        setParameters(response || []);
      } catch (error) {
        console.error('Failed to fetch parameters:', error);
        setParameters([]);
      } finally {
        setParametersLoading(false);
      }
    };

    fetchParameters();
  }, []);

  // Render pagination component
  const renderPagination = (category: string, totalItems: number) => {
    const totalPages = getTotalPages(totalItems, category);
    const current = currentPage[category];
    const itemsPerPageValue = itemsPerPage[category];
    
    if (totalItems === 0) return null;

    // Calculate page range to show
    const maxVisiblePages = 5;
    let startPage = Math.max(1, current - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pageNumbers = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Items per page:</span>
            <Select 
              value={itemsPerPageValue.toString()} 
              onValueChange={(value) => handleItemsPerPageChange(category, parseInt(value))}
            >
              <SelectTrigger className="w-20 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="30">30</SelectItem>
                <SelectItem value="40">40</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {(current - 1) * itemsPerPageValue + 1} to {Math.min(current * itemsPerPageValue, totalItems)} of {totalItems} entries
          </div>
        </div>
        
        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => current > 1 && handlePageChange(category, current - 1)}
                  className={current <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {/* First page */}
              {startPage > 1 && (
                <>
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(category, 1)}
                      className="cursor-pointer"
                    >
                      1
                    </PaginationLink>
                  </PaginationItem>
                  {startPage > 2 && (
                    <PaginationItem>
                      <span className="px-3 py-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  )}
                </>
              )}
              
              {/* Page numbers */}
              {pageNumbers.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => handlePageChange(category, page)}
                    isActive={current === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {/* Last page */}
              {endPage < totalPages && (
                <>
                  {endPage < totalPages - 1 && (
                    <PaginationItem>
                      <span className="px-3 py-2 text-muted-foreground">...</span>
                    </PaginationItem>
                  )}
                  <PaginationItem>
                    <PaginationLink
                      onClick={() => handlePageChange(category, totalPages)}
                      className="cursor-pointer"
                    >
                      {totalPages}
                    </PaginationLink>
                  </PaginationItem>
                </>
              )}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => current < totalPages && handlePageChange(category, current + 1)}
                  className={current >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    );
  };

  // Professional table renders
  const renderFlowsList = (flows: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Running Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Deployment Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Type of Mediation
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flows.length === 0 ? (
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No flows found</span>
                  </div>
                </TableCell>
            ) : (
              flows.map((flow: any) => {
                const runningStatus = flow.running_status || 'Stopped';
                const isDeployed = flow.is_deployed;
                
                return (
                  <TableRow 
                    key={flow.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{flow.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          runningStatus === 'Running' ? 'bg-success text-success-foreground border-success' :
                          runningStatus === 'Partial' ? 'bg-warning text-warning-foreground border-warning' :
                          'bg-destructive text-destructive-foreground border-destructive'
                        }`}
                      >
                        {runningStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          isDeployed ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {isDeployed ? "Deployed" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {flow.mediation_type || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {flow.updated_at ? new Date(flow.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {flow.updated_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/flows/${flow.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportFlow(flow)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleCloneFlow(flow)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteFlow(flow.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('flows', totalCount)}
    </div>
  );

  const renderNodesList = (nodes: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Mediation Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Node Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Version
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {nodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No nodes found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              nodes.map((node: any) => {
                const isDeployed = node.is_deployed;
                
                return (
                  <TableRow 
                    key={node.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{node.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          isDeployed ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {isDeployed ? "Deployed" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.mediation_type || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.node_type || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.version || '1.0'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.updated_at ? new Date(node.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {node.updated_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/nodes/${node.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportNode(node)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteNode(node.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('nodes', totalCount)}
    </div>
  );

  const renderSubnodesList = (subnodes: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Mediation Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Node Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Version
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subnodes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No subnodes found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              subnodes.map((subnode: any) => {
                const isDeployed = subnode.is_deployed;
                
                return (
                  <TableRow 
                    key={subnode.id} 
                    className="hover:bg-muted/20 transition-colors"
                  >
                    <TableCell className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{subnode.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium ${
                          isDeployed ? 'bg-success text-success-foreground border-success' : 'bg-warning text-warning-foreground border-warning'
                        }`}
                      >
                        {isDeployed ? "Deployed" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.mediation_type || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.node_type || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.version || '1.0'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.updated_at ? new Date(subnode.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.updated_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => navigate(`/subnodes/${subnode.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2" 
                          onClick={() => handleExportSubnode(subnode)}
                        >
                          <Download className="h-3 w-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 px-2 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteSubnode(subnode.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('subnodes', totalCount)}
    </div>
  );

  const renderParametersList = (parameters: any[], totalCount: number) => (
    <div className="space-y-4">
      <div className="overflow-hidden border border-border rounded-lg bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Name
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Data Type
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Direction
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Is Required
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Default Value
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Update Date
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Last Updated By
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm">No parameters found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              parameters.map((parameter: any) => (
                <TableRow 
                  key={parameter.id} 
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="px-6 py-4">
                    <div>
                      <div className="font-medium text-foreground">{parameter.name}</div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="text-xs">
                      {parameter.data_type || 'String'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        parameter.direction === 'INPUT' ? 'bg-info/20 text-info border-info' : 'bg-warning/20 text-warning border-warning'
                      }`}
                    >
                      {parameter.direction || 'INPUT'}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        parameter.is_required ? 'bg-destructive/20 text-destructive border-destructive' : 'bg-muted/20 text-muted-foreground border-muted'
                      }`}
                    >
                      {parameter.is_required ? "Required" : "Optional"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {parameter.default_value || 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {parameter.updated_at ? new Date(parameter.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'N/A'}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                    {parameter.updated_by || 'System'}
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2" 
                        onClick={() => navigate(`/parameters/${parameter.id}`)}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2" 
                        onClick={() => handleExportParameter(parameter)}
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-destructive hover:text-destructive" 
                        onClick={() => handleDeleteParameter(parameter.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {renderPagination('parameters', totalCount)}
    </div>
  );

  const fetchLatestGit = async () => {
    if (!gitLoading) {
      await fetchGitInfo();
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gitLoading) {
        void fetchLatestGit();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [gitLoading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-6 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Development Tools</h1>
              <p className="text-lg text-muted-foreground">Manage and monitor your enterprise development environment</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setGitInfo(null)}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Refresh All
              </Button>
              <Button variant="default" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Dashboard Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Flows</p>
                  <p className="text-3xl font-bold text-foreground">{flows?.length || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {flows?.filter(f => f.is_deployed).length || 0} deployed
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Workflow className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Nodes</p>
                  <p className="text-3xl font-bold text-foreground">{nodes?.length || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {nodes?.filter(n => n.is_deployed).length || 0} deployed
                  </p>
                </div>
                <div className="h-12 w-12 bg-info/10 rounded-lg flex items-center justify-center">
                  <Database className="h-6 w-6 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Subnodes</p>
                  <p className="text-3xl font-bold text-foreground">{subnodesData?.results?.length || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {subnodesData?.results?.length || 0} active
                  </p>
                </div>
                <div className="h-12 w-12 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Network className="h-6 w-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20 hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Parameters</p>
                  <p className="text-3xl font-bold text-foreground">{parameters?.length || 0}</p>
                  <p className="text-xs text-muted-foreground mt-1">Active configurations</p>
                </div>
                <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                  <Grid3X3 className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Tabs */}
        <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs defaultValue="flows" className="w-full">
              <div className="border-b border-border bg-muted/30 px-6 py-4">
                <TabsList className="bg-background/50 border border-border shadow-sm">
                  <TabsTrigger value="flows" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Workflow className="mr-2 h-4 w-4" />
                    Flows Management
                  </TabsTrigger>
                  <TabsTrigger value="nodes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Database className="mr-2 h-4 w-4" />
                    Nodes Management
                  </TabsTrigger>
                  <TabsTrigger value="subnodes" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Network className="mr-2 h-4 w-4" />
                    Subnodes Management
                  </TabsTrigger>
                  <TabsTrigger value="parameters" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    Parameters Management
                  </TabsTrigger>
                  <TabsTrigger value="git" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <GitCommit className="mr-2 h-4 w-4" />
                    Version Control
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="flows" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">Flow Management</h3>
                      <p className="text-muted-foreground mt-1">Create, deploy, and manage your data processing flows</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Flow
                      </Button>
                      <Button onClick={() => setShowCreateFlowDialog(true)} className="bg-gradient-to-r from-primary to-primary-glow hover:shadow-lg transition-all duration-300">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Flow
                      </Button>
                    </div>
                  </div>
                  
                  {flowsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Loading flows...</p>
                      </div>
                    </div>
                  ) : (
                    renderFlowsList(getPaginatedItems(flows, 'flows'), flows.length)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="nodes" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">Node Management</h3>
                      <p className="text-muted-foreground mt-1">Configure and deploy processing nodes for your data pipelines</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Node
                      </Button>
                      <Button onClick={() => navigate('/nodes/create')} className="bg-gradient-to-r from-info to-info/80 hover:shadow-lg transition-all duration-300">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Node
                      </Button>
                    </div>
                  </div>
                  
                  {nodesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-info"></div>
                        <p className="text-muted-foreground">Loading nodes...</p>
                      </div>
                    </div>
                  ) : (
                    renderNodesList(getPaginatedItems(nodes, 'nodes'), nodes.length)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="subnodes" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">Subnode Management</h3>
                      <p className="text-muted-foreground mt-1">Manage subnode configurations and deployments</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Subnode
                      </Button>
                      <Button onClick={() => navigate('/subnodes/create')} className="bg-gradient-to-r from-warning to-warning/80 hover:shadow-lg transition-all duration-300">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Subnode
                      </Button>
                    </div>
                  </div>
                  
                  {subnodesLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-warning"></div>
                        <p className="text-muted-foreground">Loading subnodes...</p>
                      </div>
                    </div>
                  ) : (
                    renderSubnodesList(getPaginatedItems(subnodesData?.results || [], 'subnodes'), subnodesData?.results?.length || 0)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="parameters" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">Parameter Management</h3>
                      <p className="text-muted-foreground mt-1">Define and manage configuration parameters for your system</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <Upload className="mr-2 h-4 w-4" />
                        Import Parameters
                      </Button>
                      <Button onClick={() => navigate('/parameters/create')} className="bg-gradient-to-r from-success to-success/80 hover:shadow-lg transition-all duration-300">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Parameter
                      </Button>
                    </div>
                  </div>
                  
                  {parametersLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-success"></div>
                        <p className="text-muted-foreground">Loading parameters...</p>
                      </div>
                    </div>
                  ) : (
                    renderParametersList(getPaginatedItems(parameters, 'parameters'), parameters.length)
                  )}
                </div>
              </TabsContent>

              <TabsContent value="git" className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-semibold text-foreground">Version Control</h3>
                      <p className="text-muted-foreground mt-1">Track changes and manage your repository history</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View on GitHub
                      </Button>
                      <Button onClick={fetchGitInfo} disabled={gitLoading} className="bg-gradient-to-r from-primary to-primary-glow">
                        <RefreshCcw className="mr-2 h-4 w-4" />
                        Refresh Git Info
                      </Button>
                    </div>
                  </div>
                  
                  <Card className="shadow-lg border-0 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30 border-b border-border">
                      <CardTitle className="flex items-center gap-2">
                        <GitCommit className="h-5 w-5 text-primary" />
                        Repository Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      {gitLoading ? (
                        <div className="flex items-center justify-center py-12">
                          <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <p className="text-muted-foreground">Loading Git information...</p>
                          </div>
                        </div>
                      ) : gitInfo ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Current Branch</p>
                                    <p className="text-xl font-bold text-foreground">{gitInfo.currentBranch || 'main'}</p>
                                  </div>
                                  <GitFork className="h-8 w-8 text-primary" />
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Commits</p>
                                    <p className="text-xl font-bold text-foreground">{gitInfo.totalCommits}</p>
                                  </div>
                                  <GitCommit className="h-8 w-8 text-info" />
                                </div>
                              </CardContent>
                            </Card>
                            
                            <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-muted-foreground">Repository Status</p>
                                    <p className="text-xl font-bold text-success">Active</p>
                                  </div>
                                  <Badge className="bg-success text-success-foreground">Live</Badge>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                          
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-foreground">Recent Commits</h4>
                            <div className="space-y-3">
                              {(gitInfo.recentCommits || []).map((commit, index) => (
                                <Card key={index} className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary">
                                  <CardContent className="p-4">
                                    <div className="flex items-start gap-4">
                                      <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <GitCommit className="h-4 w-4 text-primary" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="font-medium text-foreground truncate">{commit.message}</p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                          <span className="font-medium">{commit.author}</span>
                                          <Badge variant="outline" className="text-xs">{commit.hash.substring(0, 7)}</Badge>
                                          <span>{commit.date}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <div className="flex flex-col items-center gap-4">
                            <div className="h-16 w-16 bg-muted/50 rounded-full flex items-center justify-center">
                              <GitCommit className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                              <h3 className="text-lg font-medium text-foreground">No Git information available</h3>
                              <p className="text-muted-foreground mt-1">Click refresh to load repository information</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

            </Tabs>
          </CardContent>
        </Card>

        {/* Dialogs */}
        <CreateFlowDialog 
          open={showCreateFlowDialog} 
          onOpenChange={setShowCreateFlowDialog} 
        />
        
        <CloneFlowDialog 
          open={showCloneFlowDialog} 
          onOpenChange={setShowCloneFlowDialog} 
          sourceFlow={flowToClone}
          onClone={(sourceFlow, newName, newDescription) => {
            const clonedFlow = {
              ...sourceFlow,
              id: Date.now().toString(),
              name: newName,
              description: newDescription,
              is_active: false,
              is_deployed: false,
              created_at: new Date().toISOString(),
              created_by: "Current User"
            };
            setFlows([...flows, clonedFlow]);
            navigate(`/flows/${clonedFlow.id}/edit`);
          }}
        />
      </div>
    </div>
  );
}
