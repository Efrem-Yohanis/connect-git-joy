import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Edit, Trash2, History, ChevronDown, CheckCircle, Clock, User, Plus, Copy, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type Node, type NodeVersion } from "@/services/nodeService";
import { subnodeService, type SubnodeVersion } from "@/services/subnodeService";

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Node version management
  const [nodeVersions, setNodeVersions] = useState<NodeVersion[]>([]);
  const [nodeVersionsLoading, setNodeVersionsLoading] = useState(false);
  const [nodeVersionsOpen, setNodeVersionsOpen] = useState(false);
  
  // Subnode version management - track versions for each subnode
  const [subnodeVersions, setSubnodeVersions] = useState<Record<string, SubnodeVersion[]>>({});
  const [subnodeVersionsLoading, setSubnodeVersionsLoading] = useState<Record<string, boolean>>({});
  const [subnodeVersionsOpen, setSubnodeVersionsOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchNode = async () => {
      if (!id) return;
      
      try {
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
      } catch (err: any) {
        console.error("Error fetching node:", err);
        setError(err.response?.data?.error || err.message || "Error fetching node");
        toast({
          title: "Error",
          description: "Failed to load node details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchNode();
  }, [id, toast]);

  // Fetch node versions
  const fetchNodeVersions = async () => {
    if (!id || nodeVersions.length > 0) return;
    
    setNodeVersionsLoading(true);
    try {
      const versions = await nodeService.getNodeVersions(id);
      setNodeVersions(versions);
    } catch (err: any) {
      console.error('Error fetching node versions:', err);
      toast({
        title: "Error",
        description: "Failed to load node versions",
        variant: "destructive"
      });
    } finally {
      setNodeVersionsLoading(false);
    }
  };

  // Fetch subnode versions
  const fetchSubnodeVersions = async (subnodeId: string) => {
    if (subnodeVersions[subnodeId]?.length > 0) return;
    
    setSubnodeVersionsLoading(prev => ({ ...prev, [subnodeId]: true }));
    try {
      const versions = await subnodeService.getSubnodeVersions(subnodeId);
      setSubnodeVersions(prev => ({ ...prev, [subnodeId]: versions }));
    } catch (err: any) {
      console.error('Error fetching subnode versions:', err);
      toast({
        title: "Error",
        description: "Failed to load subnode versions",
        variant: "destructive"
      });
    } finally {
      setSubnodeVersionsLoading(prev => ({ ...prev, [subnodeId]: false }));
    }
  };

  const handleNodeVersionsToggle = () => {
    setNodeVersionsOpen(!nodeVersionsOpen);
    if (!nodeVersionsOpen && nodeVersions.length === 0) {
      fetchNodeVersions();
    }
  };

  const handleSubnodeVersionsToggle = (subnodeId: string) => {
    setSubnodeVersionsOpen(prev => ({ 
      ...prev, 
      [subnodeId]: !prev[subnodeId] 
    }));
    if (!subnodeVersionsOpen[subnodeId] && !subnodeVersions[subnodeId]?.length) {
      fetchSubnodeVersions(subnodeId);
    }
  };

  const activateNodeVersion = async (version: number) => {
    if (!id) return;
    
    try {
      await nodeService.activateNodeVersion(id, version);
      
      setNodeVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          is_active: v.version === version
        }))
      );
      
      const updatedNode = await nodeService.getNode(id);
      setNode(updatedNode);
      
      toast({
        title: "Version Activated",
        description: `Node version ${version} is now active`,
      });
    } catch (err: any) {
      console.error('Error activating node version:', err);
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive"
      });
    }
  };

  const activateSubnodeVersion = async (subnodeId: string, version: number) => {
    try {
      await subnodeService.activateVersion(subnodeId, version);
      
      setSubnodeVersions(prev => ({
        ...prev,
        [subnodeId]: prev[subnodeId]?.map(v => ({
          ...v,
          is_active: v.version === version
        })) || []
      }));
      
      if (id) {
        const updatedNode = await nodeService.getNode(id);
        setNode(updatedNode);
      }
      
      toast({
        title: "Subnode Version Activated",
        description: `Subnode version ${version} is now active`,
      });
    } catch (err: any) {
      console.error('Error activating subnode version:', err);
      toast({
        title: "Error",
        description: "Failed to activate subnode version",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!node) {
    return <div>Node not found</div>;
  }

  const renderVersionHistory = (versions: NodeVersion[] | SubnodeVersion[], isLoading: boolean, onActivate: (version: number) => void, title: string) => (
    <div className="border border-border rounded-lg p-4 bg-muted/20">
      <div className="flex items-center space-x-2 mb-4">
        <History className="h-5 w-5" />
        <h3 className="font-semibold">{title}</h3>
      </div>
      
      {isLoading ? (
        <div className="text-center py-4 text-muted-foreground">
          Loading versions...
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
                  <Badge variant={version.is_active ? "default" : "outline"}>
                    v{version.version}
                  </Badge>
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
                            This will make version {version.version} the active version. 
                            The current active version will be deactivated. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onActivate(version.version)}>
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
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">{node.name}</h1>
          <Badge variant="outline">v{node.version}</Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button onClick={() => navigate(`/nodes/${id}/edit`)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Node
          </Button>
          <Button variant="outline" onClick={() => navigate('/nodes')}>
            Back to Nodes
          </Button>
        </div>
      </div>

      {/* Node Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Created At</h3>
          <p>{new Date(node.created_at).toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Last Updated</h3>
          <p>{new Date(node.last_updated_at).toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Current Version</h3>
          <div className="flex items-center space-x-2">
            <Badge variant="outline">v{node.version}</Badge>
            <Collapsible open={nodeVersionsOpen} onOpenChange={handleNodeVersionsToggle}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2">
                  <History className="h-3 w-3 mr-1" />
                  Version History
                  <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${nodeVersionsOpen ? 'rotate-180' : ''}`} />
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </div>

      {/* Node Version History Panel */}
      <Collapsible open={nodeVersionsOpen} onOpenChange={setNodeVersionsOpen}>
        <CollapsibleContent className="space-y-4">
          {renderVersionHistory(
            nodeVersions, 
            nodeVersionsLoading, 
            activateNodeVersion, 
            "Node Version History"
          )}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Subnodes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Subnodes</h2>
        {node.subnodes && node.subnodes.length > 0 ? (
          <div className="space-y-4">
            {node.subnodes.map((subnode: any) => (
              <Card key={subnode.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <CardTitle className="text-lg">{subnode.name}</CardTitle>
                      <Badge variant={subnode.is_selected ? "default" : "secondary"}>
                        {subnode.is_selected ? "Selected" : "Not Selected"}
                      </Badge>
                      <Badge variant="outline">v{subnode.version}</Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Collapsible 
                        open={subnodeVersionsOpen[subnode.id]} 
                        onOpenChange={() => handleSubnodeVersionsToggle(subnode.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-6 px-2">
                            <History className="h-3 w-3 mr-1" />
                            Version History
                            <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${subnodeVersionsOpen[subnode.id] ? 'rotate-180' : ''}`} />
                          </Button>
                        </CollapsibleTrigger>
                      </Collapsible>
                      <Button 
                        size="sm" 
                        onClick={() => navigate(`/subnodes/${subnode.id}`)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Subnode Version History */}
                  <Collapsible open={subnodeVersionsOpen[subnode.id]}>
                    <CollapsibleContent>
                      {renderVersionHistory(
                        subnodeVersions[subnode.id] || [], 
                        subnodeVersionsLoading[subnode.id] || false, 
                        (version) => activateSubnodeVersion(subnode.id, version), 
                        `${subnode.name} Version History`
                      )}
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Parameters */}
                  {subnode.parameters && subnode.parameters.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Parameters</h4>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Key</TableHead>
                            <TableHead>Default Value</TableHead>
                            <TableHead>Required</TableHead>
                            <TableHead>Last Updated</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {subnode.parameters.map((param: any) => (
                            <TableRow key={param.id}>
                              <TableCell className="font-medium">{param.key}</TableCell>
                              <TableCell>{param.default_value}</TableCell>
                              <TableCell>
                                <Badge variant={param.required ? "default" : "secondary"}>
                                  {param.required ? "Required" : "Optional"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(param.last_updated_at).toLocaleString()}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No subnodes available for this node.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}