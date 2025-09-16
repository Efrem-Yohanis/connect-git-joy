import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowLeft, Edit, Play, Square, History, Plus, TestTube, Trash2, Copy, Download, MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface UniformDetailHeaderProps {
  // Basic info
  name: string;
  version?: string | number;
  status: 'deployed' | 'active' | 'published' | 'running' | 'stopped' | 'draft' | 'editable';
  
  // Back navigation
  backRoute: string;
  backTab?: 'flows' | 'nodes' | 'subnodes' | 'parameters';
  
  // Action handlers
  onEditVersion?: () => void;
  onToggleDeployment?: () => void;
  onCreateNewVersion?: () => void;
  onShowVersionHistory?: () => void;
  onDeleteVersion?: () => void;
  onCloneVersion?: () => void;
  onExportVersion?: () => void;
  onTestAction?: () => void;
  
  // States
  isLoading?: boolean;
  isEditable?: boolean;
  
  // Custom actions for dropdown
  customActions?: Array<{
    label: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    destructive?: boolean;
    disabled?: boolean;
  }>;
}

export function UniformDetailHeader({
  name,
  version,
  status,
  backRoute,
  backTab,
  onEditVersion,
  onToggleDeployment,
  onCreateNewVersion,
  onShowVersionHistory,
  onDeleteVersion,
  onCloneVersion,
  onExportVersion,
  onTestAction,
  isLoading = false,
  isEditable = false,
  customActions = []
}: UniformDetailHeaderProps) {
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (backTab) {
      navigate(`${backRoute}?tab=${backTab}`);
    } else {
      navigate(backRoute);
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'deployed':
      case 'active':
      case 'published':
        return <Badge className="bg-green-500 text-white">Deployed</Badge>;
      case 'running':
        return <Badge className="bg-success text-white">Running</Badge>;
      case 'editable':
        return <Badge variant="secondary">Editable</Badge>;
      case 'draft':
        return <Badge variant="outline" className="text-muted-foreground">Draft</Badge>;
      case 'stopped':
      default:
        return <Badge variant="outline" className="text-muted-foreground">Stopped</Badge>;
    }
  };

  const isDeployed = ['deployed', 'active', 'published', 'running'].includes(status);

  return (
    <div className="space-y-4">
      {/* Main Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-4xl font-bold">{name}</h1>
          {version && (
            <Badge variant="outline" className="text-base px-3 py-1">
              v{version}
            </Badge>
          )}
          {getStatusBadge()}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Dynamic Edit/Create New Version Button */}
          {isEditable ? (
            <Button 
              variant="outline"
              onClick={onEditVersion}
              disabled={isLoading || !onEditVersion}
              size="icon"
              title="Edit Version"
            >
              <Edit className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline"
              onClick={onCreateNewVersion}
              disabled={isLoading || !onCreateNewVersion}
              size="icon"
              title="Create New Version"
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
          
          {/* Dynamic Deploy/Undeploy Button */}
          {onToggleDeployment && (
            <Button 
              variant={isDeployed ? "destructive" : "default"}
              onClick={onToggleDeployment}
              disabled={isLoading}
              size="icon"
              title={isDeployed ? "Undeploy" : "Deploy"}
            >
              {isDeployed ? <Square className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          )}
          
          {/* Version History Button */}
          {onShowVersionHistory && (
            <Button 
              variant="outline" 
              onClick={onShowVersionHistory}
              disabled={isLoading}
              size="icon"
              title="Version History"
            >
              <History className="h-4 w-4" />
            </Button>
          )}

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
              {onTestAction && (
                <DropdownMenuItem onClick={onTestAction} disabled={isLoading}>
                  <TestTube className="h-4 w-4 mr-2" />
                  Test
                </DropdownMenuItem>
              )}
              {onExportVersion && (
                <DropdownMenuItem onClick={onExportVersion} disabled={isLoading}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Version
                </DropdownMenuItem>
              )}
              {onCloneVersion && (
                <DropdownMenuItem onClick={onCloneVersion} disabled={isLoading}>
                  <Copy className="h-4 w-4 mr-2" />
                  Clone Version
                </DropdownMenuItem>
              )}
              {customActions.map((action, index) => (
                <DropdownMenuItem 
                  key={index}
                  onClick={action.onClick} 
                  disabled={isLoading || action.disabled}
                  className={action.destructive ? "text-destructive focus:text-destructive" : ""}
                >
                  <action.icon className="h-4 w-4 mr-2" />
                  {action.label}
                </DropdownMenuItem>
              ))}
              {onDeleteVersion && (
                <DropdownMenuItem 
                  onClick={onDeleteVersion} 
                  disabled={isLoading || isDeployed}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Version
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}