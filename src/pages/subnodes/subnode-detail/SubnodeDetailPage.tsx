import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSubnode, subnodeService, SubnodeVersionWithParametersByNodeVersion } from "@/services/subnodeService";
import { toast } from "sonner";
import { UniformDetailHeader } from "@/components/UniformDetailHeader";
import { UniformDetailBackButton } from "@/components/UniformDetailBackButton";
import { SubnodeInfo } from "./components/SubnodeInfo";
import { ParameterValuesTable } from "./components/ParameterValuesTable";
import { VersionHistoryModal } from "./components/VersionHistoryModal";
import { CreateVersionModal } from "./components/CreateVersionModal";
import { LoadingCard } from "@/components/ui/loading";

export function SubnodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedVersion, setSelectedVersion] = useState<SubnodeVersionWithParametersByNodeVersion | null>(null);
  const [showVersionHistoryModal, setShowVersionHistoryModal] = useState(false);
  const [showCreateVersionModal, setShowCreateVersionModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: subnode, loading, error, refetch } = useSubnode(id || '');
  const [searchParams] = useSearchParams();
  const versionParam = searchParams.get('version');

  // Set initial version when subnode data loads
  useEffect(() => {
    if (subnode && subnode.versions.length > 0) {
      // If version is specified in URL, try to find and select it
      if (versionParam) {
        const versionNumber = parseInt(versionParam);
        const targetVersion = subnode.versions.find(v => v.version === versionNumber);
        if (targetVersion) {
          setSelectedVersion(targetVersion);
          return;
        }
      }
      
      // If there's a published version, use it
      if (subnode.published_version) {
        setSelectedVersion(subnode.published_version);
      } else if (subnode.last_version) {
        // Use last version if no published version
        setSelectedVersion(subnode.last_version);
      } else {
        // Fallback to latest version by number
        const sortedVersions = [...subnode.versions].sort((a, b) => b.version - a.version);
        setSelectedVersion(sortedVersions[0]);
      }
    }
  }, [subnode, versionParam]);

  if (loading) {
    return <LoadingCard text="Loading subnode..." className="min-h-[400px]" />;
  }

  if (error || !subnode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading subnode: {error}</p>
          <button onClick={() => refetch()} className="btn">Try Again</button>
        </div>
      </div>
    );
  }

  const handleEditVersion = () => {
    if (selectedVersion) {
      navigate(`/subnodes/${id}/edit-version?version=${selectedVersion.version}`);
    }
  };

  const handleDeployVersion = async () => {
    if (!selectedVersion) return;
    
    setIsLoading(true);
    try {
      await subnodeService.activateVersion(id!, selectedVersion.version);
      toast.success(`Version ${selectedVersion.version} deployed successfully`);
      await refetch();
      // Update selected version to reflect deployment status
      if (subnode) {
        const updatedVersion = subnode.versions.find(v => v.version === selectedVersion.version);
        if (updatedVersion) {
          setSelectedVersion({ ...updatedVersion, is_deployed: true });
        }
      }
    } catch (error) {
      toast.error("Failed to deploy version");
      console.error("Deploy error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndeployVersion = async () => {
    if (!selectedVersion) return;
    
    setIsLoading(true);
    try {
      await subnodeService.undeployVersion(id!, selectedVersion.version);
      toast.success(`Version ${selectedVersion.version} undeployed successfully`);
      await refetch();
      // Update selected version to reflect undeployment status
      setSelectedVersion({ ...selectedVersion, is_deployed: false });
    } catch (error) {
      toast.error("Failed to undeploy version");
      console.error("Undeploy error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewVersion = async (comment: string) => {
    setIsLoading(true);
    try {
      const response = await subnodeService.createEditableVersion(id!, { version_comment: comment });
      console.log("New version created:", response); // Debug log
      
      // The API returns full subnode detail with all versions
      if (response.versions && response.versions.length > 0) {
        // Find the newly created editable version
        const newVersion = response.versions.find(v => v.is_editable && !v.is_deployed);
        if (newVersion) {
          toast.success(`New version ${newVersion.version} created successfully`);
          setShowCreateVersionModal(false);
          navigate(`/subnodes/${id}/edit-version?version=${newVersion.version}`);
        } else {
          toast.error("Could not find the newly created version");
          await refetch();
        }
      } else {
        toast.error("Invalid version data returned from server");
        await refetch();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Failed to create new version";
      toast.error(errorMessage);
      console.error("Create version error:", error);
      console.error("Error response data:", error.response?.data);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectVersion = (version: SubnodeVersionWithParametersByNodeVersion) => {
    setSelectedVersion(version);
    setShowVersionHistoryModal(false);
  };

  const handleActivateVersionFromModal = async (version: SubnodeVersionWithParametersByNodeVersion) => {
    setIsLoading(true);
    try {
      await subnodeService.activateVersion(id!, version.version);
      toast.success(`Version ${version.version} activated successfully`);
      await refetch();
      // Update selected version and close modal
      setSelectedVersion({ ...version, is_deployed: true });
      setShowVersionHistoryModal(false);
    } catch (error) {
      toast.error("Failed to activate version");
      console.error("Activate error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Uniform Header */}
      <UniformDetailHeader
        name={subnode.name}
        version={selectedVersion?.version}
        status={selectedVersion?.is_deployed ? 'deployed' : 'draft'}
        backRoute="/devtool"
        backTab="subnodes"
        isEditable={selectedVersion && !selectedVersion.is_deployed && selectedVersion.is_editable}
        onEditVersion={handleEditVersion}
        onCreateNewVersion={() => setShowCreateVersionModal(true)}
        onToggleDeployment={selectedVersion?.is_deployed ? handleUndeployVersion : handleDeployVersion}
        onShowVersionHistory={() => setShowVersionHistoryModal(true)}
        onExportVersion={async () => {
          if (!selectedVersion) return;
          try {
            const data = await subnodeService.exportSubnode(id!);
            const dataStr = JSON.stringify(data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${subnode.name}_v${selectedVersion.version}.json`;
            link.click();
            toast.success(`Version ${selectedVersion.version} exported successfully`);
          } catch (error) {
            toast.error("Failed to export version");
          }
        }}
        onCloneVersion={async () => {
          if (!selectedVersion) return;
          try {
            await subnodeService.cloneSubnode(subnode.id, {
              name: `${subnode.name}_v${selectedVersion.version}_clone`
            });
            toast.success(`Version ${selectedVersion.version} cloned successfully`);
            refetch();
          } catch (error) {
            toast.error("Failed to clone version");
          }
        }}
        onDeleteVersion={async () => {
          if (!selectedVersion) return;
          const confirmDelete = confirm(`Are you sure you want to delete version ${selectedVersion.version}? This action cannot be undone.`);
          if (!confirmDelete) return;
          try {
            await subnodeService.deleteSubnodeVersion(subnode.id, selectedVersion.version);
            toast.success(`Version ${selectedVersion.version} deleted successfully`);
            refetch();
          } catch (error) {
            toast.error("Failed to delete version");
          }
        }}
        isLoading={isLoading}
      />

      {/* Subnode Basic Information */}
      <SubnodeInfo 
        subnode={subnode} 
        selectedVersion={selectedVersion} 
      />

      {/* Parameter Values Table */}
      <ParameterValuesTable 
        selectedVersion={selectedVersion} 
      />

      {/* Version History Modal */}
      <VersionHistoryModal
        open={showVersionHistoryModal}
        onOpenChange={setShowVersionHistoryModal}
        versions={subnode.versions}
        selectedVersion={selectedVersion}
        onSelectVersion={handleSelectVersion}
        onActivateVersion={handleActivateVersionFromModal}
        isLoading={isLoading}
      />

      {/* Create Version Modal */}
      <CreateVersionModal
        open={showCreateVersionModal}
        onOpenChange={setShowCreateVersionModal}
        onCreateVersion={handleCreateNewVersion}
        isLoading={isLoading}
      />

      {/* Back Button */}
      <div className="flex justify-end pt-6">
        <UniformDetailBackButton backRoute="/devtool" backTab="subnodes" />
      </div>
    </div>
  );
}
