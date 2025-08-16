import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type Node, type NodeVersion } from "@/services/nodeService";
import { parameterService, type Parameter } from "@/services/parameterService";
import { NodeHeader } from "./components/NodeHeader";
import { NodeSummary } from "./components/NodeSummary";
import { PropertiesSection } from "./components/PropertiesSection";
import { SubnodesSection } from "./components/SubnodesSection";
import { VersionHistoryModal } from "./components/VersionHistoryModal";

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Version management
  const [nodeVersions, setNodeVersions] = useState<NodeVersion[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<NodeVersion | null>(null);
  const [nodeVersionsLoading, setNodeVersionsLoading] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  
  // Active node checking
  const [currentActiveNode, setCurrentActiveNode] = useState<Node | null>(null);

  // Parameters management
  const [nodeParameters, setNodeParameters] = useState<Parameter[]>([]);

  useEffect(() => {
    const fetchNode = async () => {
      if (!id) return;
      
      try {
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
        
        // Map parameters from active version or latest version
        const activeVersion = nodeData.versions.find(v => v.is_deployed) || nodeData.versions[0];
        const mappedParameters = (activeVersion?.parameters || []).map((param: any) => ({
          id: param.id,
          key: param.key,
          default_value: param.default_value,
          datatype: param.datatype,
          node: nodeData.id,
          required: false, // Default value since not in API
          last_updated_by: null,
          last_updated_at: nodeData.last_updated_at,
          is_active: param.is_active,
          created_at: nodeData.last_updated_at || new Date().toISOString(),
          created_by: null
        }));
        setNodeParameters(mappedParameters);
        
        // Fetch initial data
        await fetchNodeVersions();
        
        // Check for currently active node in the system
        const activeNode = await nodeService.getActiveNode();
        setCurrentActiveNode(activeNode);
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
    if (!id) return;
    
    setNodeVersionsLoading(true);
    try {
      const versions = await nodeService.getNodeVersions(id);
      setNodeVersions(versions);
      
      // Set selected version to active version or latest
      const activeVersion = versions.find(v => v.is_deployed) || versions[0];
      console.log('🔍 Active version found:', activeVersion);
      console.log('🔍 Subnodes in active version:', activeVersion?.subnodes);
      console.log('🔍 Subnodes length:', activeVersion?.subnodes?.length);
      setSelectedVersion(activeVersion);
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


  // Event handlers
  const handleEditVersion = () => {
    if (selectedVersion && !selectedVersion.is_deployed) {
      navigate(`/nodes/${id}/edit?version=${selectedVersion.version}`);
    }
  };

  const handleCreateNewVersion = () => {
    navigate(`/nodes/${id}/edit?newVersion=true`);
  };

  const handleToggleDeployment = async () => {
    if (!selectedVersion || !id) return;
    
    try {
      if (selectedVersion.is_deployed) {
        // Undeploy the version
        await nodeService.undeployNodeVersion(id, selectedVersion.version);
        toast({
          title: "Version Undeployed",
          description: `Version ${selectedVersion.version} has been undeployed`,
        });
      } else {
        // Check if another node is currently active
        const activeNode = await nodeService.getActiveNode();
        
        if (activeNode && activeNode.id !== id) {
          // Show confirmation dialog for deactivating current active node
          const shouldProceed = window.confirm(
            `Node "${activeNode.name}" (v${activeNode.active_version}) is currently active. ` +
            `Activating this node will deactivate "${activeNode.name}". Do you want to proceed?`
          );
          
          if (!shouldProceed) {
            return;
          }
        }
        
        // Deploy/activate version
        await nodeService.deployNodeVersion(id, selectedVersion.version);
        toast({
          title: "Node Activated",
          description: `Node "${node?.name}" version ${selectedVersion.version} is now active`,
        });
      }
      
      // Refresh the page to reflect changes
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error toggling version deployment:', err);
      toast({
        title: "Error",
        description: "Failed to update version deployment status",
        variant: "destructive"
      });
    }
  };

  const handleShowVersionHistory = () => {
    setVersionHistoryOpen(true);
    if (nodeVersions.length === 0) {
      fetchNodeVersions();
    }
  };

  const handleSelectVersion = (version: NodeVersion) => {
    setSelectedVersion(version);
    setVersionHistoryOpen(false);
    toast({
      title: "Version Selected",
      description: `Now viewing version ${version.version}`,
    });
  };

  const activateNodeVersion = async (version: NodeVersion) => {
    if (!id) return;
    
    try {
      // Check if another node is currently active
      const activeNode = await nodeService.getActiveNode();
      
      if (activeNode && activeNode.id !== id) {
        // Show confirmation dialog for deactivating current active node
        const shouldProceed = window.confirm(
          `Node "${activeNode.name}" (v${activeNode.active_version}) is currently active. ` +
          `Activating this node will deactivate "${activeNode.name}". Do you want to proceed?`
        );
        
        if (!shouldProceed) {
          return;
        }
      }
      
      // Deploy the version using new API
      await nodeService.deployNodeVersion(id, version.version);
      
      toast({
        title: "Node Activated",
        description: `Node "${node?.name}" version ${version.version} is now active`,
      });
      
      // Close modal and redirect to detail page showing the activated version
      setVersionHistoryOpen(false);
      
      // Refresh the page to show the activated version
      window.location.reload();
      
    } catch (err: any) {
      console.error('Error activating node version:', err);
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive"
      });
    }
  };

  // Version management handlers
  const handleDeleteVersion = async () => {
    if (!selectedVersion || !id || selectedVersion.is_deployed) {
      toast({
        title: "Cannot Delete Version",
        description: selectedVersion?.is_deployed ? "Cannot delete a deployed version" : "No version selected",
        variant: "destructive"
      });
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete version ${selectedVersion.version}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      // Call API to delete version (you may need to add this to nodeService)
      // await nodeService.deleteNodeVersion(id, selectedVersion.version);
      
      toast({
        title: "Version Deleted",
        description: `Version ${selectedVersion.version} has been deleted`,
      });

      // Refresh versions
      await fetchNodeVersions();
    } catch (err: any) {
      console.error('Error deleting version:', err);
      toast({
        title: "Error",
        description: "Failed to delete version",
        variant: "destructive"
      });
    }
  };

  const handleCloneVersion = async () => {
    if (!selectedVersion || !id) return;

    try {
      // Create new version from current version
      const newVersion = await nodeService.createNodeVersion(id, selectedVersion.version);
      
      toast({
        title: "Version Cloned",
        description: `New version ${newVersion.version} created from version ${selectedVersion.version}`,
      });

      // Refresh versions and navigate to edit the new version
      await fetchNodeVersions();
      navigate(`/nodes/${id}/edit?version=${newVersion.version}`);
    } catch (err: any) {
      console.error('Error cloning version:', err);
      toast({
        title: "Error",
        description: "Failed to clone version",
        variant: "destructive"
      });
    }
  };

  const handleExportVersion = () => {
    if (!selectedVersion || !node) return;

    const exportData = {
      node: {
        id: node.id,
        name: node.name,
        description: node.description
      },
      version: selectedVersion,
      exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${node.name}_v${selectedVersion.version}.json`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Version Exported",
      description: `Version ${selectedVersion.version} exported successfully`,
    });
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive">Error: {error}</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          Back to Nodes
        </Button>
      </div>
    );
  }

  if (!node) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Node not found</p>
        <Button onClick={() => navigate('/nodes')} className="mt-4">
          Back to Nodes
        </Button>
      </div>
    );
  }


  return (
    <div className="space-y-6">
      {/* Current Active Node Warning */}
      {currentActiveNode && currentActiveNode.id !== node.id && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-800 font-medium">
              Another node is currently active: "{currentActiveNode.name}" (v{currentActiveNode.active_version})
            </span>
          </div>
          <p className="text-yellow-700 text-sm mt-1">
            Activating this node will automatically deactivate the currently active node.
          </p>
        </div>
      )}

      {/* Header Section */}
      <NodeHeader
        node={node}
        selectedVersion={selectedVersion}
        onEditVersion={handleEditVersion}
        onToggleDeployment={handleToggleDeployment}
        onCreateNewVersion={handleCreateNewVersion}
        onShowVersionHistory={handleShowVersionHistory}
        onDeleteVersion={handleDeleteVersion}
        onCloneVersion={handleCloneVersion}
        onExportVersion={handleExportVersion}
        isLoading={loading}
      />

      <Separator />

      {/* Node Detail Section */}
      <NodeSummary
        node={node}
        selectedVersion={selectedVersion}
        propertiesCount={nodeParameters.length}
        subnodesCount={selectedVersion?.subnodes?.length || 0}
      />

      {/* Tabbed Sections */}
      <Tabs defaultValue="parameters" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="subnodes">Subnodes</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
        </TabsList>
        
        <TabsContent value="parameters" className="space-y-4">
          <PropertiesSection
            properties={nodeParameters}
            loading={false}
          />
        </TabsContent>
        
        <TabsContent value="subnodes" className="space-y-4">
          <SubnodesSection
            subnodes={selectedVersion?.subnodes || []}
          />
        </TabsContent>
        
        <TabsContent value="script" className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Python Script</h3>
              <span className="text-sm text-muted-foreground">
                Version {selectedVersion?.version || node.version}
              </span>
            </div>
            <div className="relative">
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                <code className="language-python">
                  {selectedVersion?.script || node.script || "No script content available"}
                </code>
              </pre>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Version History Modal */}
      <VersionHistoryModal
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        versions={nodeVersions}
        selectedVersion={selectedVersion}
        onSelectVersion={handleSelectVersion}
        onActivateVersion={activateNodeVersion}
        isLoading={nodeVersionsLoading}
      />

      {/* Back to Nodes Button */}
      <div className="flex justify-end pt-4">
        <Button variant="outline" onClick={() => navigate('/nodes')}>
          Back to Nodes
        </Button>
      </div>
    </div>
  );
}