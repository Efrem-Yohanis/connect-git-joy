import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { LoadingCard, LoadingSpinner } from "@/components/ui/loading";
import { FlowCanvas } from "./FlowCanvas"; // Import FlowCanvas
import { Play, Square, History, ChevronDown, CheckCircle, Clock, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { flowService, FlowVersion } from "@/services/flowService";
import axios from "axios";

export function FlowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [versions, setVersions] = useState<FlowVersion[]>([]);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);

  useEffect(() => {
    const fetchFlowStructure = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/flows/${id}/structure/`);
        setFlow(response.data);
      } catch (err) {
        setError("Error fetching flow structure");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowStructure();
  }, [id]);

  // Fetch versions when requested
  const fetchVersions = async () => {
    if (!id || versions.length > 0) return; // Don't refetch if already loaded
    
    setVersionsLoading(true);
    try {
      const flowVersions = await flowService.getFlowVersions(id);
      setVersions(flowVersions);
    } catch (err) {
      console.error('Error fetching flow versions:', err);
      toast({
        title: "Error",
        description: "Failed to load flow versions",
        variant: "destructive"
      });
    } finally {
      setVersionsLoading(false);
    }
  };

  const handleVersionsToggle = () => {
    setVersionsOpen(!versionsOpen);
    if (!versionsOpen && versions.length === 0) {
      fetchVersions();
    }
  };

  const activateVersion = async (version: number) => {
    if (!id) return;
    
    try {
      await flowService.activateFlowVersion(id, version);
      
      // Update versions list to reflect the change
      setVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          is_active: v.version === version
        }))
      );
      
      // Refresh flow data
      const response = await axios.get(`http://127.0.0.1:8000/api/flows/${id}/structure/`);
      setFlow(response.data);
      
      toast({
        title: "Version Activated",
        description: `Flow version ${version} is now active`,
      });
    } catch (err) {
      console.error('Error activating version:', err);
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <LoadingCard text="Loading flow details..." />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!flow) {
    return <div>No flow found.</div>;
  }

  const getFlowStatus = () => {
    if (flow.is_running) return "running";
    if (flow.is_deployed) return "deployed";
    return "draft";
  };

  const getStatusBadge = () => {
    const status = getFlowStatus();
    switch (status) {
      case "running":
        return <Badge variant="default">🟢 Running</Badge>;
      case "deployed":
        return <Badge variant="secondary">🟡 Deployed</Badge>;
      case "draft":
        return <Badge variant="outline">📝 Draft</Badge>;
      default:
        return <Badge variant="outline">❓ Unknown</Badge>;
    }
  };

  const canEdit = () => {
    return !flow.is_deployed; // Only undeployed flows can be edited directly
  };

  const canStartStop = () => {
    return flow.is_deployed; // Only deployed flows can be started/stopped
  };

  // Helper function to determine node type based on name or other criteria
  const getNodeType = (nodeName: string): string => {
    const name = nodeName.toLowerCase();
    if (name.includes('sftp') || name.includes('collector')) return 'sftp_collector';
    if (name.includes('fdc')) return 'fdc';
    if (name.includes('asn1') || name.includes('decoder')) return 'asn1_decoder';
    if (name.includes('ascii')) return 'ascii_decoder';
    if (name.includes('validation')) return 'validation_bln';
    if (name.includes('enrichment')) return 'enrichment_bln';
    if (name.includes('encoder')) return 'encoder';
    if (name.includes('diameter')) return 'diameter_interface';
    if (name.includes('backup')) return 'raw_backup';
    return 'generic';
  };

  // Create unique nodes map to avoid duplicates
  const uniqueNodes = new Map();
  flow.flow_nodes.forEach((flowNode) => {
    if (!uniqueNodes.has(flowNode.node.id)) {
      uniqueNodes.set(flowNode.node.id, flowNode);
    }
  });

  // Prepare nodes from the unique nodes with proper positioning
  const nodes = Array.from(uniqueNodes.values()).map((flowNode, index) => {
    const nodeType = getNodeType(flowNode.node.name);
    
    return {
      id: flowNode.node.id,
      type: nodeType,
      position: { 
        x: (index % 4) * 300 + 100, // Arrange in a grid pattern
        y: Math.floor(index / 4) * 200 + 100 
      },
      data: {
        label: flowNode.node.name,
        description: `Version: ${flowNode.node.version}`,
        node: flowNode.node,
        selected_subnode: flowNode.selected_subnode,
        parameters: flowNode.selected_subnode?.parameter_values || [],
        subnodes: flowNode.node.subnodes || [],
      },
    };
  });

  // Prepare edges from all outgoing edges, removing duplicates
  const uniqueEdges = new Map();
  flow.flow_nodes.forEach((flowNode) => {
    flowNode.outgoing_edges?.forEach((edge) => {
      if (!uniqueEdges.has(edge.id)) {
        uniqueEdges.set(edge.id, {
          id: edge.id,
          source: edge.from_node,
          target: edge.to_node,
          animated: true,
          label: edge.condition || undefined,
        });
      }
    });
  });
  
  const edges = Array.from(uniqueEdges.values());

  const handleRunFlow = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/flows/${id}/start/`);
      setFlow(prev => ({ ...prev, is_running: true }));
      toast({
        title: "Flow Started",
        description: "The flow has been started successfully.",
      });
    } catch (err: any) {
      console.error("Error starting flow:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error starting flow";
      toast({
        title: "Error Starting Flow",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleStopFlow = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/flows/${id}/stop/`);
      setFlow(prev => ({ ...prev, is_running: false }));
      toast({
        title: "Flow Stopped",
        description: "The flow has been stopped successfully.",
      });
    } catch (err: any) {
      console.error("Error stopping flow:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error stopping flow";
      toast({
        title: "Error Stopping Flow",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleCreateNewVersion = () => {
    // For deployed flows, creating a new version means cloning to a new draft
    toast({
      title: "Creating New Version",
      description: "This will create a new draft version that can be edited.",
    });
    navigate(`/flows/${id}/clone`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">{flow.name}</h1>
          {getStatusBadge()}
        </div>
        <div className="flex items-center space-x-2">
          {canStartStop() && !flow.is_running && (
            <Button onClick={handleRunFlow}>
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          {canStartStop() && flow.is_running && (
            <Button variant="destructive" onClick={handleStopFlow}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          {canEdit() ? (
            <Button onClick={() => navigate(`/flows/${id}/edit`)}>
              Edit Flow
            </Button>
          ) : (
            <Button onClick={() => handleCreateNewVersion()}>
              Create New Version
            </Button>
          )}
        </div>
      </div>

      {/* Flow Information */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p>{flow.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Created At</h3>
          <p>{new Date(flow.created_at).toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Created By</h3>
          <p>{flow.created_by}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Current Version</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">v{flow.version || 1}</Badge>
            <Collapsible open={versionsOpen} onOpenChange={handleVersionsToggle}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <History className="h-3 w-3 mr-1" />
                  Version History
                  <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${versionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Version History Panel */}
      <Collapsible open={versionsOpen} onOpenChange={setVersionsOpen}>
        <CollapsibleContent className="space-y-4">
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center space-x-2 mb-4">
              <History className="h-5 w-5" />
              <h3 className="font-semibold">Version History</h3>
            </div>
            
            {versionsLoading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner />
              </div>
            ) : versions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge variant={version.is_active ? "default" : "outline"}>
                            v{version.version}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {version.is_active ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-700 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Inactive</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{version.created_by}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(version.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {version.description || 'No description'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {!version.is_active && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Activate
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Activate Version {version.version}</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will make version {version.version} the active version of this flow. 
                                  The current active version will be deactivated. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => activateVersion(version.version)}>
                                  Activate Version
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        {version.is_active && (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No version history available
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Flow Canvas */}
      <div className="h-[600px] border border-border rounded-lg">
        <FlowCanvas nodes={nodes} edges={edges} onNodeSelect={(node) => console.log(node)} />
      </div>
    </div>
  );
}