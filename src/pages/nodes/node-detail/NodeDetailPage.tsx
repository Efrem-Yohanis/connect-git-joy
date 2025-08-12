import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
        
        // Set node versions from the fetched data
        setNodeVersions(nodeData.versions);
        
        // Find the active version or use the first version
        const activeVersion = nodeData.versions.find(v => v.is_deployed) || nodeData.versions[0];
        setSelectedVersion(activeVersion);
        
        // Map parameters from the active/selected version
        const mappedParameters = (activeVersion?.parameters || []).map((param: any) => ({
          id: param.id,
          key: param.key,
          default_value: param.default_value,
          datatype: param.datatype,
          node: nodeData.id,
          required: false, // Default value since not in API
          last_updated_by: null,
          last_updated_at: nodeData.last_updated_at,
          is_active: param.is_active
        }));
        setNodeParameters(mappedParameters);
        
        // No need to check for globally active node since multiple nodes can be active
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

  // Fetch node versions - now simplified since we get them from the main API call
  const fetchNodeVersions = async () => {
    if (!id || !node) return;
    
    setNodeVersionsLoading(true);
    try {
      // We already have versions from the main node API call, but refresh if needed
      const nodeData = await nodeService.getNode(id);
      const versions = nodeData.versions;
      setNodeVersions(versions);
      
      // Set selected version to active version or latest
      const activeVersion = versions.find(v => v.is_deployed) || versions[0];
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
        // For now, just show a message that deactivation would happen
        toast({
          title: "Toggle Deployment",
          description: `Version ${selectedVersion.version} deployment would be toggled`,
        });
      } else {
        // Deploy/activate version (multiple nodes can be active simultaneously)
        await nodeService.activateNodeVersion(id, selectedVersion.version);
        toast({
          title: "Node Activated",
          description: `Node "${node?.name}" version ${selectedVersion.version} is now active`,
        });
        
        // Refresh versions
        await fetchNodeVersions();
        
        // Refresh node data
        const updatedNode = await nodeService.getNode(id);
        setNode(updatedNode);
      }
      
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

  const handleViewVersion = async (version: NodeVersion) => {
    if (!id) return;
    
    try {
      // Fetch specific version details from API
      const versionDetails = await nodeService.getNodeVersion(id, version.version);
      setSelectedVersion(versionDetails);
      
      // Map parameters from the selected version
      const mappedParameters = (versionDetails.parameters || []).map((param: any) => ({
        id: param.id,
        key: param.key,
        default_value: param.default_value,
        datatype: param.datatype,
        node: node!.id,
        required: false,
        last_updated_by: null,
        last_updated_at: node!.last_updated_at,
        is_active: param.is_active
      }));
      setNodeParameters(mappedParameters);
      
      setVersionHistoryOpen(false);
      toast({
        title: "Version Selected",
        description: `Now viewing version ${version.version}`,
      });
    } catch (err: any) {
      console.error('Error fetching version details:', err);
      toast({
        title: "Error",
        description: "Failed to load version details",
        variant: "destructive"
      });
    }
  };

  const activateNodeVersion = async (version: number) => {
    if (!id) return;
    
    try {
      // Activate version (multiple nodes can be active simultaneously)
      await nodeService.activateNodeVersion(id, version);
      
      // Fetch the updated version details to get the latest data
      const versionDetails = await nodeService.getNodeVersion(id, version);
      
      // Update versions state
      setNodeVersions(prevVersions => 
        prevVersions.map(v => ({
          ...v,
          is_deployed: v.version === version
        }))
      );
      
      // Update selected version with fresh data
      setSelectedVersion({ ...versionDetails, is_deployed: true });
      
      // Map parameters from the activated version
      const mappedParameters = (versionDetails.parameters || []).map((param: any) => ({
        id: param.id,
        key: param.key,
        default_value: param.default_value,
        datatype: param.datatype,
        node: node!.id,
        required: false,
        last_updated_by: null,
        last_updated_at: node!.last_updated_at,
        is_active: param.is_active
      }));
      setNodeParameters(mappedParameters);
      
      // Refresh node data
      const updatedNode = await nodeService.getNode(id);
      setNode(updatedNode);
      
        // No need to update global active node state since multiple nodes can be active
      
      toast({
        title: "Node Activated",
        description: `Node "${node?.name}" version ${version} is now active`,
      });
      
      setVersionHistoryOpen(false);
    } catch (err: any) {
      console.error('Error activating node version:', err);
      toast({
        title: "Error",
        description: "Failed to activate version",
        variant: "destructive"
      });
    }
  };

  const handleCloneNode = async () => {
    if (!id) return;
    
    try {
      const clonedNode = await nodeService.cloneNode(id);
      toast({
        title: "Node Cloned",
        description: `Node "${clonedNode.name}" has been created`,
      });
      navigate(`/nodes/${clonedNode.id}/edit`);
    } catch (err: any) {
      console.error('Error cloning node:', err);
      toast({
        title: "Error",
        description: "Failed to clone node",
        variant: "destructive"
      });
    }
  };

  const handleExportVersion = async () => {
    if (!selectedVersion || !id) return;
    
    try {
      const blob = await nodeService.exportVersion(id, selectedVersion.version);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${node?.name}_v${selectedVersion.version}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: "Export Complete",
        description: `Version ${selectedVersion.version} exported successfully`,
      });
    } catch (err: any) {
      console.error('Error exporting version:', err);
      toast({
        title: "Error",
        description: "Failed to export version",
        variant: "destructive"
      });
    }
  };

  const handleDeleteVersion = async () => {
    if (!selectedVersion || !id) return;
    
    const shouldDelete = window.confirm(
      `Are you sure you want to delete version ${selectedVersion.version}? This action cannot be undone.`
    );
    
    if (!shouldDelete) return;
    
    try {
      await nodeService.deleteNodeVersion(id, selectedVersion.version);
      
      // Refresh versions
      await fetchNodeVersions();
      
      toast({
        title: "Version Deleted",
        description: `Version ${selectedVersion.version} has been deleted`,
      });
    } catch (err: any) {
      console.error('Error deleting version:', err);
      toast({
        title: "Error",
        description: "Failed to delete version",
        variant: "destructive"
      });
    }
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

      {/* Header Section */}
      <NodeHeader
        node={node}
        selectedVersion={selectedVersion}
        onEditVersion={handleEditVersion}
        onToggleDeployment={handleToggleDeployment}
        onCreateNewVersion={handleCreateNewVersion}
        onShowVersionHistory={handleShowVersionHistory}
        onCloneNode={handleCloneNode}
        onExportVersion={handleExportVersion}
        onDeleteVersion={handleDeleteVersion}
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

      <Separator />

      {/* Properties Section */}
      <PropertiesSection
        properties={nodeParameters}
        loading={false}
      />

      <Separator />

      {/* Subnodes Section */}
      {(() => {
        console.log('🔍 Rendering SubnodesSection - selectedVersion:', selectedVersion);
        console.log('🔍 Rendering SubnodesSection - subnodes:', selectedVersion?.subnodes);
        return (
          <SubnodesSection
            subnodes={selectedVersion?.subnodes || []}
          />
        );
      })()}

      {/* Version History Modal */}
      <VersionHistoryModal
        open={versionHistoryOpen}
        onOpenChange={setVersionHistoryOpen}
        versions={nodeVersions}
        loading={nodeVersionsLoading}
        onActivateVersion={activateNodeVersion}
        onViewVersion={handleViewVersion}
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