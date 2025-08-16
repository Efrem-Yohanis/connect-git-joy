import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Play, Square, History, Plus, TestTube, Trash2, Copy, Download, MoreVertical } from "lucide-react";
import { Node, NodeVersion } from "@/services/nodeService";
import { useNavigate } from "react-router-dom";

interface NodeHeaderProps {
  node: Node;
  selectedVersion: NodeVersion | null;
  onEditVersion: () => void;
  onToggleDeployment: () => void;
  onCreateNewVersion: () => void;
  onShowVersionHistory: () => void;
  onDeleteVersion: () => void;
  onCloneVersion: () => void;
  onExportVersion: () => void;
  isLoading?: boolean;
}

export function NodeHeader({
  node,
  selectedVersion,
  onEditVersion,
  onToggleDeployment,
  onCreateNewVersion,
  onShowVersionHistory,
  onDeleteVersion,
  onCloneVersion,
  onExportVersion,
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
          {/* Dynamic Edit/Create New Version Button */}
          {isEditable ? (
            <Button 
              variant="outline"
              onClick={onEditVersion}
              disabled={isLoading}
              size="icon"
              title="Edit Version"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={onCreateNewVersion}
              disabled={isLoading}
              size="icon"
              title="Create New Version"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          
          {/* Dynamic Deploy/Undeploy Button */}
          <Button 
            variant={isDeployed ? "destructive" : "default"}
            onClick={onToggleDeployment}
            disabled={isLoading}
            size="icon"
            title={isDeployed ? "Undeploy Version" : "Deploy Version"}
          >
            {isDeployed ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          {/* Version History Button */}
          <Button 
            variant="outline" 
            onClick={onShowVersionHistory}
            disabled={isLoading}
            size="icon"
            title="Version History"
          >
            <History className="h-4 w-4" />
          </Button>

          {/* Three Dots Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                disabled={isLoading}
                title="More Actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleTestNode} disabled={isLoading}>
                <TestTube className="h-4 w-4 mr-2" />
                Test Node
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportVersion} disabled={isLoading}>
                <Download className="h-4 w-4 mr-2" />
                Export Version
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onCloneVersion} disabled={isLoading}>
                <Copy className="h-4 w-4 mr-2" />
                Clone Version
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDeleteVersion} 
                disabled={isLoading || isDeployed}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Version
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}