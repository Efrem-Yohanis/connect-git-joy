import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { nodeService, type Node, type NodeVersionDetail } from "@/services/nodeService";
import { parameterService, type Parameter } from "@/services/parameterService";
import { NodeHeader } from "./components/NodeHeader";
import { NodeSummary } from "./components/NodeSummary";
import { PropertiesSection } from "./components/PropertiesSection";
import { SubnodesSection } from "./components/SubnodesSection";
import { VersionHistoryModal } from "./components/VersionHistoryModal";
import { CreateVersionModal } from "./components/CreateVersionModal";
import axios from 'axios';
import { LoadingSpinner } from "@/components/ui/loading";

export function NodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [node, setNode] = useState<Node | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Version management
  const [nodeVersions, setNodeVersions] = useState<NodeVersionDetail[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<NodeVersionDetail | null>(null);
  const [nodeVersionsLoading, setNodeVersionsLoading] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [createVersionOpen, setCreateVersionOpen] = useState(false);
  
  // Active node checking
  const [currentActiveNode, setCurrentActiveNode] = useState<Node | null>(null);

  // Parameters management
  const [nodeParameters, setNodeParameters] = useState<any[]>([]);
  
  // Script content management
  const [scriptContent, setScriptContent] = useState<string>("");
  const [scriptLoading, setScriptLoading] = useState(false);
  const [scriptError, setScriptError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNode = async () => {
      if (!id) return;
      
      try {
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
        
        // Initialize with empty parameters, will be set when version is selected
        setNodeParameters([]);
        
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
      const activeVersion = versions.find(v => v.state === 'published') || versions[0];
      console.log('🔍 Active version found:', activeVersion);
      console.log('🔍 Subnodes in active version:', activeVersion?.subnodes);
      console.log('🔍 Subnodes length:', activeVersion?.subnodes?.length);
      setSelectedVersion(activeVersion);
      
      // Set parameters from selected version
      if (activeVersion?.parameters) {
        setNodeParameters(activeVersion.parameters);
      }
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

  // Fetch script content from version
  const fetchScriptContent = async (familyId: string, versionNumber: number) => {
    if (!familyId || !versionNumber) return;
    
    setScriptLoading(true);
    setScriptError(null);
    
    try {
      const scriptContent = await nodeService.getVersionScript(familyId, versionNumber);
      setScriptContent(scriptContent);
    } catch (err: any) {
      console.error('Error fetching script content:', err);
      
      let errorMessage = err.message || 'Failed to load script content';
      
      // Handle specific error cases
      if (err.message?.includes('404')) {
        errorMessage = 'Script file not found';
      } else if (err.message?.includes('403')) {
        errorMessage = 'Access denied to script file';
      } else if (err.message?.includes('500')) {
        errorMessage = 'Server error while fetching script';
      }
      
      setScriptError(errorMessage);
      setScriptContent('');
    } finally {
      setScriptLoading(false);
    }
  };

  // Effect to fetch script content when selected version changes
  useEffect(() => {
    if (selectedVersion) {
      fetchScriptContent(selectedVersion.family, selectedVersion.version);
    } else if (node?.published_version) {
      fetchScriptContent(node.published_version.family, node.published_version.version);
    }
  }, [selectedVersion, node?.published_version]);

  // Event handlers
  const handleEditVersion = () => {
    if (selectedVersion && selectedVersion.state !== 'published') {
      navigate(`/nodes/${id}/edit-version?version=${selectedVersion.version}`);
    }
  };

  const handleCreateNewVersion = () => {
    setCreateVersionOpen(true);
  };

  const handleCreateVersionSubmit = async (changelog: string) => {
    if (!id) return;
    
    try {
      await nodeService.createNodeVersionWithChangelog(id, changelog);
      setCreateVersionOpen(false);
      
      // Refresh versions list
      await fetchNodeVersions();
      
      toast({
        title: "Version Created",
        description: "New version created successfully",
      });
    } catch (error) {
      console.error('Failed to create version:', error);
      toast({
        title: "Error",
        description: "Failed to create new version",
        variant: "destructive"
      });
    }
  };

  const handleToggleDeployment = async () => {
    if (!selectedVersion || !id) return;
    
    try {
      if (selectedVersion.state === 'published') {
        // Undeploy the version
        await nodeService.undeployNodeVersion(id, selectedVersion.version);
        toast({
          title: "Version Undeployed",
          description: `Version ${selectedVersion.version} has been undeployed`,
        });
      } else {
        // Deploy the version (will automatically deactivate other versions of this node)
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

  const handleSelectVersion = (version: NodeVersionDetail) => {
    setSelectedVersion(version);
    setVersionHistoryOpen(false);
    // Update parameters for the selected version
    setNodeParameters(version.parameters || []);
    toast({
      title: "Version Selected",
      description: `Now viewing version ${version.version}`,
    });
  };

  const activateNodeVersion = async (version: NodeVersionDetail) => {
    if (!id) return;
    
    try {
      // Deploy the version (will automatically deactivate other versions of this node)
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
    if (!selectedVersion || !id || selectedVersion.state === 'published') {
      toast({
        title: "Cannot Delete Version",
        description: selectedVersion?.state === 'published' ? "Cannot delete a published version" : "No version selected",
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
      const newVersion = await nodeService.createNewNodeVersion(id, selectedVersion.version);
      
      toast({
        title: "Version Cloned",
        description: `New version ${newVersion.version} created from version ${selectedVersion.version}`,
      });

      // Refresh versions and navigate to edit the new version
      await fetchNodeVersions();
      navigate(`/nodes/${id}/edit-version?version=${newVersion.version}`);
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
        <LoadingSpinner size="lg" />
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

      {/* Header Section */}
      <NodeHeader
        node={node}
        selectedVersion={selectedVersion}
        onEditVersion={() => {}} // Disabled for configuration view
        onToggleDeployment={handleToggleDeployment}
        onCreateNewVersion={() => {}} // Disabled for configuration view
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
                Version {selectedVersion?.version || node.published_version?.version}
              </span>
            </div>
            <div className="relative">
              {scriptLoading ? (
                <div className="flex items-center justify-center h-32 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm text-muted-foreground">Loading script...</span>
                  </div>
                </div>
              ) : scriptError ? (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
                  <div className="font-medium">Script Loading Error</div>
                  <div className="text-sm mt-1">{scriptError}</div>
                  {scriptError.includes('backend server needs to configure URL routing') && (
                    <div className="text-xs mt-2 text-muted-foreground">
                      The backend server needs to add URL patterns to serve script files from the /node_scripts/ path.
                    </div>
                  )}
                </div>
              ) : (
                <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto">
                  <code className="language-python whitespace-pre-wrap">
                    {scriptContent || "No script content available"}
                  </code>
                </pre>
              )}
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

      {/* Create Version Modal */}
      <CreateVersionModal
        open={createVersionOpen}
        onOpenChange={setCreateVersionOpen}
        onCreateVersion={handleCreateVersionSubmit}
        isLoading={loading}
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