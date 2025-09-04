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
  GitCommit,
  GitBranch,
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
import axios from "axios";

export function DevToolPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Display limits state
  const [displayLimits, setDisplayLimits] = useState<{[key: string]: number}>({
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
  const [gitInfo, setGitInfo] = useState<any>(null);
  const [gitLoading, setGitLoading] = useState(true);

  // Helper functions
  const handleDisplayLimitChange = (category: string, limit: number) => {
    setDisplayLimits(prev => ({ ...prev, [category]: limit }));
  };

  const getDisplayedItems = (items: any[], category: string) => {
    return items.slice(0, displayLimits[category]);
  };

  // Render controls component
  const renderViewControls = (category: string, itemCount: number) => (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Label htmlFor={`limit-${category}`} className="text-xs font-medium text-muted-foreground">
          Display:
        </Label>
        <Select
          value={displayLimits[category].toString()}
          onValueChange={(value) => handleDisplayLimitChange(category, parseInt(value))}
        >
          <SelectTrigger className="w-16 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value={itemCount.toString()}>All</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Eye className="h-3.5 w-3.5" />
        <span>{Math.min(displayLimits[category], itemCount)} of {itemCount}</span>
      </div>
    </div>
  );

  // Professional table renders
  const renderFlowsList = (flows: any[]) => (
    <div className="overflow-hidden">
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
              Created
            </TableHead>
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {flows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Workflow className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm">No flows found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            flows.map((flow: any) => (
              <TableRow key={flow.id} className="hover:bg-muted/30 transition-colors">
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
                    variant={flow.is_deployed ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {flow.is_deployed ? "Deployed" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {new Date(flow.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => navigate(`/flows/${flow.id}/edit`)}
                    >
                      <Settings className="h-4 w-4" />
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderNodesList = (nodes: any[]) => (
    <div className="overflow-hidden">
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
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Network className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm">No nodes found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            nodes.map((node: any) => (
              <TableRow key={node.id} className="hover:bg-muted/30 transition-colors">
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
                    variant={node.is_deployed ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {node.is_deployed ? "Deployed" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {node.version || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => navigate(`/nodes/${node.id}/edit`)}
                    >
                      <Settings className="h-4 w-4" />
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderSubnodesList = (subnodes: any[]) => (
    <div className="overflow-hidden">
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
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {subnodes.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <GitFork className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm">No subnodes found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            subnodes.map((subnode: any) => (
              <TableRow key={subnode.id} className="hover:bg-muted/30 transition-colors">
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
                    variant={subnode.active_version ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {subnode.active_version ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-muted-foreground">
                  {subnode.active_version || 'N/A'}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => navigate(`/subnodes/${subnode.id}/edit`)}
                    >
                      <Settings className="h-4 w-4" />
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
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  const renderParametersList = (parameters: any[]) => (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/30">
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Key
            </TableHead>
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Value
            </TableHead>
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </TableHead>
            <TableHead className="h-12 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider text-right">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parameters.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                <div className="flex flex-col items-center gap-2">
                  <Settings className="h-8 w-8 text-muted-foreground/50" />
                  <span className="text-sm">No parameters found</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            parameters.map((param: any) => (
              <TableRow key={param.id} className="hover:bg-muted/30 transition-colors">
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
                    variant={param.is_active ? "default" : "secondary"}
                    className="text-xs font-medium"
                  >
                    {param.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0" 
                      onClick={() => navigate(`/parameters/${param.id}/edit`)}
                    >
                      <Settings className="h-4 w-4" />
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
            ))
          )}
        </TableBody>
      </Table>
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

  // Fetch git information
  const fetchGitInfo = async () => {
    try {
      // Mock git data since we can't access actual git in frontend
      // In a real implementation, this would call an API endpoint
      const mockGitData = {
        lastCommit: {
          hash: "a1b2c3d4",
          message: "feat: add devtool git integration",
          author: "Developer",
          date: new Date().toISOString(),
          branch: "main"
        },
        status: "clean",
        totalCommits: 42
      };
      
      // Simulate API delay
      setTimeout(() => {
        setGitInfo(mockGitData);
        setGitLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching git info:", error);
      setGitLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchNodes();
    fetchParameters();
    fetchGitInfo();
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
      <div className="container mx-auto max-w-7xl p-6 space-y-8">
        {/* Professional Header */}
        <div className="border-b border-border pb-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Development Tools
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage system components with full CRUD operations, import/export capabilities
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs">
                Enterprise Dashboard
              </Badge>
            </div>
          </div>
        </div>

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
                <TabsTrigger 
                  value="git" 
                  className="flex items-center gap-2 h-12 px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                >
                  <GitCommit className="h-4 w-4" />
                  <span className="font-medium">Git</span>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {renderViewControls('flows', flows.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {flows.length} flows
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg bg-card">
                      {renderFlowsList(getDisplayedItems(flows, 'flows'))}
                    </div>
                  </div>
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
                    <Button onClick={() => navigate("/nodes/create")} size="sm" className="h-9">
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {renderViewControls('nodes', nodes.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {nodes.length} nodes
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg bg-card">
                      {renderNodesList(getDisplayedItems(nodes, 'nodes'))}
                    </div>
                  </div>
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {renderViewControls('subnodes', (subnodesData?.results || []).length)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {(subnodesData?.results || []).length} subnodes
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg bg-card">
                      {renderSubnodesList(getDisplayedItems((subnodesData?.results || []), 'subnodes'))}
                    </div>
                  </div>
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
                    <Button onClick={() => navigate("/parameters/create")} size="sm" className="h-9">
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
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {renderViewControls('parameters', parameters.length)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Total: {parameters.length} parameters
                      </div>
                    </div>
                    
                    <div className="border border-border rounded-lg bg-card">
                      {renderParametersList(getDisplayedItems(parameters, 'parameters'))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Git Tab */}
            <TabsContent value="git" className="p-0">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground">Git Repository</h3>
                    <p className="text-sm text-muted-foreground">View repository information and commit history</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="h-9" onClick={fetchGitInfo}>
                      <GitCommit className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {gitLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" />
                      <span className="text-sm">Loading git information...</span>
                    </div>
                  </div>
                ) : gitInfo ? (
                  <div className="space-y-6">
                    {/* Last Commit Card */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <GitCommit className="h-5 w-5 text-primary" />
                          Latest Commit
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Commit Hash
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono">
                                  {gitInfo.lastCommit.hash}
                                </code>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Message
                              </Label>
                              <p className="text-sm text-foreground mt-1">
                                {gitInfo.lastCommit.message}
                              </p>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Author
                              </Label>
                              <p className="text-sm text-foreground mt-1">
                                {gitInfo.lastCommit.author}
                              </p>
                            </div>
                            
                            <div>
                              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                Date
                              </Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm text-foreground">
                                  {new Date(gitInfo.lastCommit.date).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Repository Stats */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                              <GitBranch className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Current Branch</p>
                              <p className="text-lg font-semibold text-foreground">
                                {gitInfo.lastCommit.branch}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                              <GitCommit className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Total Commits</p>
                              <p className="text-lg font-semibold text-foreground">
                                {gitInfo.totalCommits}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                              <Database className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Repository Status</p>
                              <Badge 
                                variant={gitInfo.status === 'clean' ? 'default' : 'secondary'}
                                className="text-xs font-medium"
                              >
                                {gitInfo.status === 'clean' ? 'Clean' : 'Modified'}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <GitCommit className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Git Information</h3>
                    <p className="text-sm text-muted-foreground text-center max-w-md">
                      Unable to fetch git repository information. Make sure this is a git repository and try refreshing.
                    </p>
                  </div>
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