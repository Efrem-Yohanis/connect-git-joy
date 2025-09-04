import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useSubnode, subnodeService, SubnodeVersionWithParametersByNodeVersion } from "@/services/subnodeService";
import { toast } from "sonner";
import { SubnodeHeader } from "./components/SubnodeHeader";
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
    <div className="space-y-6">
      {/* Header Section */}
      <SubnodeHeader
        subnode={subnode}
        selectedVersion={selectedVersion}
        onEditVersion={() => {}} // Disabled for configuration view
        onDeployVersion={handleDeployVersion}
        onUndeployVersion={handleUndeployVersion}
        onCreateNewVersion={() => {}} // Disabled for configuration view
        onShowVersionHistory={() => setShowVersionHistoryModal(true)}
        onRefresh={refetch}
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
    </div>
  );
}
