import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Play, Square, History, Plus, MoreVertical, Download, Copy, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FlowData {
  id: string;
  name: string;
  version?: number;
  is_deployed: boolean;
  is_running: boolean;
}

interface FlowHeaderProps {
  flow: FlowData;
  onCreateNewVersion: () => void;
  onEditVersion: () => void;
  onToggleDeployment: () => void;
  onShowVersionHistory: () => void;
  onExportVersion: () => void;
  onCloneVersion: () => void;
  onDeleteVersion: () => void;
  isLoading?: boolean;
}

export function FlowHeader({
  flow,
  onCreateNewVersion,
  onEditVersion,
  onToggleDeployment,
  onShowVersionHistory,
  onExportVersion,
  onCloneVersion,
  onDeleteVersion,
  isLoading = false
}: FlowHeaderProps) {
  const navigate = useNavigate();
  const isDeployed = flow.is_deployed;
  const isRunning = flow.is_running;
  const isEditable = !isDeployed;

  const getStatusBadge = () => {
    if (isRunning) {
      return <Badge className="bg-success text-white">Running</Badge>;
    }
    if (isDeployed) {
      return <Badge className="bg-warning text-white">Published</Badge>;
    }
    return <Badge variant="secondary">Editable</Badge>;
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <h1 className="text-4xl font-bold">{flow.name}</h1>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
            v{flow.version || 1}
          </div>
          {getStatusBadge()}
        </div>
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
          title={isDeployed ? "Undeploy" : "Deploy"}
        >
          {isDeployed ? (
            <Square className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
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
  );
}