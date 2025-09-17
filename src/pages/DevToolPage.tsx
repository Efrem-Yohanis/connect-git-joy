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
  ChevronRight
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
import { useSection } from "@/contexts/SectionContext";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import axios from "axios";

export function DevToolPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setCurrentSection, setStatusCounts } = useSection();

  // Set section context for DevTool page
  useEffect(() => {
    setCurrentSection("Development Tools");
    setStatusCounts({ total: 0, deployed: 0, drafted: 0 }); // Hide status counts
  }, [setCurrentSection, setStatusCounts]);
  
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
      <div className="flex items-center justify-between px-2 py-4 border-t border-border bg-muted/20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>
              {((current - 1) * itemsPerPageValue) + 1} - {Math.min(current * itemsPerPageValue, totalItems)} of {totalItems}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Label className="text-sm text-muted-foreground">Show:</Label>
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
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-sm text-muted-foreground">per page</span>
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
      <div className="overflow-hidden border border-border rounded-lg bg-card">
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
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Workflow className="h-8 w-8 text-muted-foreground/50" />
                    <span className="text-sm">No flows found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              flows.map((flow: any) => {
                const runningStatus = flow.running_status || 'Stopped';
                const isDeployed = flow.is_deployed;
                
                return (
                  <TableRow 
                    key={flow.id} 
                    className={`hover:bg-muted/30 transition-colors ${
                      isDeployed ? 'bg-success/5' : 'bg-warning/5'
                    }`}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                          <Workflow className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{flow.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {flow.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium border-0 ${
                          runningStatus === 'Running' ? 'bg-success text-success-foreground' :
                          runningStatus === 'Partial' ? 'bg-warning text-warning-foreground' :
                          'bg-destructive text-destructive-foreground'
                        }`}
                      >
                        {runningStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium border-0 ${
                          isDeployed ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
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
                          className="h-8 w-8 p-0" 
                          onClick={() => navigate(`/flows/${flow.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleExportFlow(flow)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleCloneFlow(flow)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteFlow(flow.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
      <div className="overflow-hidden border border-border rounded-lg bg-card">
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
                    <Network className="h-8 w-8 text-muted-foreground/50" />
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
                    className={`hover:bg-muted/30 transition-colors ${
                      isDeployed ? 'bg-success/5' : 'bg-warning/5'
                    }`}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                          <Network className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{node.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {node.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium border-0 ${
                          isDeployed ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
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
                      {node.version || 'N/A'}
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
                          className="h-8 w-8 p-0" 
                          onClick={() => navigate(`/nodes/${node.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleExportNode(node)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteNode(node.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
      <div className="overflow-hidden border border-border rounded-lg bg-card">
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
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <GitFork className="h-8 w-8 text-muted-foreground/50" />
                    <span className="text-sm">No subnodes found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              subnodes.map((subnode: any) => {
                const isActive = subnode.active_version;
                const isDraft = subnode.status === 'Draft';
                
                return (
                  <TableRow 
                    key={subnode.id} 
                    className={`hover:bg-muted/30 transition-colors ${
                      isActive && !isDraft ? 'bg-success/5' : 'bg-warning/5'
                    }`}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500/10">
                          <GitFork className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{subnode.name}</div>
                          <div className="text-xs text-muted-foreground">ID: {subnode.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium border-0 ${
                          isActive && !isDraft ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
                        }`}
                      >
                        {isActive && !isDraft ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {subnode.active_version || 'N/A'}
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
                          className="h-8 w-8 p-0" 
                          onClick={() => navigate(`/subnodes/${subnode.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleExportSubnode(subnode)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteSubnode(subnode.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
      <div className="overflow-hidden border border-border rounded-lg bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border bg-muted/30">
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Key
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Default Value
              </TableHead>
              <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Status
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
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <Settings className="h-8 w-8 text-muted-foreground/50" />
                    <span className="text-sm">No parameters found</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              parameters.map((param: any) => {
                const isActive = param.is_active;
                const isDraft = param.status === 'Draft';
                
                return (
                  <TableRow 
                    key={param.id} 
                    className={`hover:bg-muted/30 transition-colors ${
                      isActive && !isDraft ? 'bg-success/5' : 'bg-warning/5'
                    }`}
                  >
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                          <Settings className="h-4 w-4 text-green-600" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{param.key}</div>
                          <div className="text-xs text-muted-foreground">ID: {param.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="max-w-xs">
                        <div className="truncate text-sm text-foreground font-mono bg-muted/30 px-2 py-1 rounded text-xs">
                          {param.value}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Badge 
                        variant="outline"
                        className={`text-xs font-medium border-0 ${
                          isActive && !isDraft ? 'bg-success text-success-foreground' : 'bg-warning text-warning-foreground'
                        }`}
                      >
                        {isActive && !isDraft ? "Active" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {param.updated_at ? new Date(param.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                      {param.updated_by || 'System'}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => navigate(`/parameters/${param.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0" 
                          onClick={() => handleExportParameter(param.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive" 
                          onClick={() => handleDeleteParameter(param.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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
      {renderPagination('parameters', totalCount)}
    </div>
  );

  // Fetch nodes
  const fetchNodes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/node-families/");
      setNodes(response.data.results || []);
    } catch (error) {
      console.error("Error fetching nodes:", error);
    } finally {
      setNodesLoading(false);
    }
  };

  // Fetch parameters
  const fetchParameters = async () => {
    try {
      const response = await parameterService.getParameters();
      setParameters(response);
    } catch (error) {
      console.error("Error fetching parameters:", error);
    } finally {
      setParametersLoading(false);
    }
  };


  // Initialize data
  useEffect(() => {
    fetchNodes();
    fetchParameters();
  }, []);

  // Sync flows data when it changes
  useEffect(() => {
    if (flowsData) {
      setFlows(flowsData);
    }
  }, [flowsData]);

  // Flow handlers
  const handleDeleteFlow = async (flowId: string) => {
    try {
      await deleteItem(flowId);
      setFlows(flows.filter(flow => flow.id !== flowId));
      toast({
        title: "Success",
        description: "Flow deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete flow",
        variant: "destructive",
      });
    }
  };

  const handleExportFlow = (flow: any) => {
    const dataStr = JSON.stringify(flow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${flow.name}.json`;
    link.click();
  };

  const handleCloneFlow = (flow: any) => {
    setFlowToClone(flow);
    setShowCloneFlowDialog(true);
  };

  // Node handlers
  const handleDeleteNode = async (nodeId: string) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/node-families/${nodeId}/`);
      setNodes(nodes.filter(node => node.id !== nodeId));
      toast({
        title: "Success",
        description: "Node deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete node",
        variant: "destructive",
      });
    }
  };

  const handleExportNode = (node: any) => {
    const dataStr = JSON.stringify(node, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name}.json`;
    link.click();
  };

  // Subnode handlers
  const handleDeleteSubnode = async (subnodeId: string) => {
    try {
      await subnodeService.deleteSubnode(subnodeId);
      toast({
        title: "Success",
        description: "Subnode deleted successfully",
      });
      refetchSubnodes();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete subnode",
        variant: "destructive",
      });
    }
  };

  const handleExportSubnode = (subnode: any) => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name}.json`;
    link.click();
  };

  // Parameter handlers
  const handleDeleteParameter = async (paramId: string) => {
    try {
      await parameterService.deleteParameter(paramId);
      setParameters(parameters.filter(param => param.id !== paramId));
      toast({
        title: "Success",
        description: "Parameter deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete parameter",
        variant: "destructive",
      });
    }
  };

  const handleExportParameter = async (paramId: string) => {
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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export parameter",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full p-6 space-y-8">
        {/* Professional Tabs */}
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <Tabs defaultValue="flows" className="w-full">
            <div className="border-b border-border bg-muted/30 rounded-t-lg">
              <TabsList className="h-12 w-full justify-start bg-transparent p-0">
                <TabsTrigger 
                  value="flows" 
                  className="flex items-center gap-2 h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <Workflow className="h-4 w-4" />
                  <span className="font-medium">Flows</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="nodes" 
                  className="flex items-center gap-2 h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <Network className="h-4 w-4" />
                  <span className="font-medium">Nodes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="subnodes" 
                  className="flex items-center gap-2 h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <GitFork className="h-4 w-4" />
                  <span className="font-medium">Subnodes</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="parameters" 
                  className="flex items-center gap-2 h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <Settings className="h-4 w-4" />
                  <span className="font-medium">Parameters</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Flows Tab */}
            <TabsContent value="flows" className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">Flow Management</h3>
                    <p className="text-sm text-muted-foreground">Create, edit, and manage system flows</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button onClick={() => setShowCreateFlowDialog(true)} size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      New Flow
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {flowsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm">Loading flows...</span>
                    </div>
                  </div>
                ) : (
                  renderFlowsList(getPaginatedItems(flows, 'flows'), flows.length)
                )}
              </div>
            </TabsContent>

            {/* Nodes Tab */}
            <TabsContent value="nodes" className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">Node Management</h3>
                    <p className="text-sm text-muted-foreground">Create, edit, and manage system nodes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button onClick={() => navigate("/nodes/new")} size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      New Node
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {nodesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm">Loading nodes...</span>
                    </div>
                  </div>
                ) : (
                  renderNodesList(getPaginatedItems(nodes, 'nodes'), nodes.length)
                )}
              </div>
            </TabsContent>

            {/* Subnodes Tab */}
            <TabsContent value="subnodes" className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">Subnode Management</h3>
                    <p className="text-sm text-muted-foreground">Create, edit, and manage system subnodes</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button onClick={() => navigate("/subnodes/create")} size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      New Subnode
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {subnodesLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm">Loading subnodes...</span>
                    </div>
                  </div>
                ) : (
                  renderSubnodesList(getPaginatedItems((subnodesData?.results || []), 'subnodes'), (subnodesData?.results || []).length)
                )}
              </div>
            </TabsContent>

            {/* Parameters Tab */}
            <TabsContent value="parameters" className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">Parameter Management</h3>
                    <p className="text-sm text-muted-foreground">Create, edit, and manage system parameters</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                    <Button onClick={() => navigate("/parameters/new")} size="sm" className="h-9">
                      <Plus className="h-4 w-4 mr-2" />
                      New Parameter
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {parametersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm">Loading parameters...</span>
                    </div>
                  </div>
                ) : (
                  renderParametersList(getPaginatedItems(parameters, 'parameters'), parameters.length)
                )}
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>

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
  );
}