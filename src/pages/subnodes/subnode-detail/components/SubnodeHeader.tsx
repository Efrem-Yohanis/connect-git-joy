import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Play, Square, History, MoreVertical, Copy, Download, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SubnodeDetail, SubnodeVersion, subnodeService } from "@/services/subnodeService";
import { toast } from "sonner";

interface SubnodeHeaderProps {
  subnode: SubnodeDetail;
  selectedVersion: SubnodeVersion | null;
  onEditVersion: () => void;
  onDeployVersion: () => void;
  onUndeployVersion: () => void;
  onCreateNewVersion: () => void;
  onShowVersionHistory: () => void;
  onRefresh: () => void;
  isLoading?: boolean;
}

export function SubnodeHeader({
  subnode,
  selectedVersion,
  onEditVersion,
  onDeployVersion,
  onUndeployVersion,
  onCreateNewVersion,
  onShowVersionHistory,
  onRefresh,
  isLoading = false
}: SubnodeHeaderProps) {
  const isActiveVersion = selectedVersion?.is_deployed;
  const canEdit = selectedVersion && !selectedVersion.is_deployed && selectedVersion.is_editable;

  const handleCloneVersion = async () => {
    if (!selectedVersion) return;
    
    try {
      await subnodeService.cloneSubnode(subnode.id, {
        name: `${subnode.name}_v${selectedVersion.version}_clone`
      });
      toast.success(`Version ${selectedVersion.version} cloned successfully`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to clone version");
      console.error("Clone error:", error);
    }
  };

  const handleExportVersion = async () => {
    if (!selectedVersion) return;
    
    try {
      const data = await subnodeService.exportSubnode(subnode.id);
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
      console.error("Export error:", error);
    }
  };

  const handleDeleteVersion = async () => {
    if (!selectedVersion) return;
    
    const confirmDelete = confirm(`Are you sure you want to delete version ${selectedVersion.version}? This action cannot be undone.`);
    if (!confirmDelete) return;
    
    try {
      await subnodeService.deleteSubnodeVersion(subnode.id, selectedVersion.version);
      toast.success(`Version ${selectedVersion.version} deleted successfully`);
      onRefresh();
    } catch (error) {
      toast.error("Failed to delete version");
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">🧩 {subnode.name}</h1>
          <Badge variant="outline">
            Version {selectedVersion?.version || 'Unknown'}
          </Badge>
          <Badge 
            variant={isActiveVersion ? "default" : "outline"}
            className={isActiveVersion ? "bg-green-500 text-white" : "text-muted-foreground"}
          >
            {isActiveVersion ? "🟢 Active" : "🔴 Draft"}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Version History */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={onShowVersionHistory}
            disabled={isLoading}
          >
            <History className="h-4 w-4" />
          </Button>
          
          {/* Deploy/Undeploy Button */}
          {isActiveVersion ? (
            <Button 
              variant="destructive"
              size="sm"
              onClick={onUndeployVersion}
              disabled={isLoading}
            >
              <Square className="h-4 w-4" />
            </Button>
          ) : canEdit ? (
            <Button 
              variant="default"
              size="sm"
              onClick={onDeployVersion}
              disabled={isLoading}
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : null}
          
          {/* Edit/Create Version Button */}
          {isActiveVersion ? (
            <Button 
              variant="outline"
              size="sm"
              onClick={onCreateNewVersion}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : canEdit ? (
            <Button 
              variant="outline"
              size="sm"
              onClick={onEditVersion}
              disabled={isLoading}
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : null}
          
          {/* Three-dot menu for version actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={isLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCloneVersion}>
                <Copy className="h-4 w-4 mr-2" />
                Clone SubNode Version
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportVersion}>
                <Download className="h-4 w-4 mr-2" />
                Export SubNode Version
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleDeleteVersion}
                className="text-destructive focus:text-destructive"
                disabled={isActiveVersion}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete SubNode Version
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}