import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Play, Square, History, Plus, TestTube, Copy, Download, Trash2 } from "lucide-react";
import { Node, NodeVersion } from "@/services/nodeService";
import { useNavigate } from "react-router-dom";

interface NodeHeaderProps {
  node: Node;
  selectedVersion: NodeVersion | null;
  onEditVersion: () => void;
  onToggleDeployment: () => void;
  onCreateNewVersion: () => void;
  onShowVersionHistory: () => void;
  onCloneNode: () => void;
  onExportVersion: () => void;
  onDeleteVersion: () => void;
  isLoading?: boolean;
}

export function NodeHeader({
  node,
  selectedVersion,
  onEditVersion,
  onToggleDeployment,
  onCreateNewVersion,
  onShowVersionHistory,
  onCloneNode,
  onExportVersion,
  onDeleteVersion,
  isLoading = false
}: NodeHeaderProps) {
  const navigate = useNavigate();
  const isDeployed = selectedVersion?.is_deployed;
  const isEditable = selectedVersion && !selectedVersion.is_deployed;

  const handleTestNode = () => {
    navigate(`/nodes/${node.id}/test`);
  };

  const getStatusBadge = () => {
    if (isDeployed) {
      return <Badge className="bg-green-500 text-white">Deployed</Badge>;
    }
    if (isEditable) {
      return <Badge variant="secondary">Editable</Badge>;
    }
    return <Badge variant="outline" className="text-muted-foreground">Stopped</Badge>;
  };

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold">{node.name}</h1>
          <Badge variant="outline" className="text-base px-3 py-1">
            v{selectedVersion?.version || node.version}
          </Badge>
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Show for active/deployed version */}
          {isDeployed && (
            <>
              <Button 
                variant="outline"
                onClick={onCreateNewVersion}
                disabled={isLoading}
                size="icon"
                title="Create New Version"
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="destructive"
                onClick={onToggleDeployment}
                disabled={isLoading}
                size="icon"
                title="Undeploy Version"
              >
                <Square className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={onCloneNode}
                disabled={isLoading}
                size="icon"
                title="Clone Node"
              >
                <Copy className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={onExportVersion}
                disabled={isLoading}
                size="icon"
                title="Export Version"
              >
                <Download className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                onClick={onDeleteVersion}
                disabled={isLoading}
                size="icon"
                title="Delete Version"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
          
          {/* Show for draft/undeployed version */}
          {isEditable && (
            <>
              <Button 
                variant="outline"
                onClick={onEditVersion}
                disabled={isLoading}
                size="icon"
                title="Edit Version"
              >
                <Edit className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="default"
                onClick={onToggleDeployment}
                disabled={isLoading}
                size="icon"
                title="Deploy Version"
              >
                <Play className="h-4 w-4" />
              </Button>
            </>
          )}
          
          <Button 
            variant="outline"
            onClick={handleTestNode}
            disabled={isLoading}
            size="icon"
            title="Test Node"
          >
            <TestTube className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="outline" 
            onClick={onShowVersionHistory}
            disabled={isLoading}
            size="icon"
            title="Version History"
          >
            <History className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}