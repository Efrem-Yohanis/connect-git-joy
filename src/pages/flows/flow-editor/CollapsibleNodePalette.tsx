import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { nodeService } from '@/services/nodeService';
import { 
  Database, 
  Filter, 
  CheckCircle, 
  AlertCircle,
  RotateCcw,
  Activity,
  FileText,
  Globe,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface CollapsibleNodePaletteProps {
  onAddNode: (nodeId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: (collapsed: boolean) => void;
}

// Icon mapping for different node types
const getNodeIcon = (nodeName?: string) => {
  const name = (nodeName ?? '').toLowerCase();
  if (!name) return Activity;
  if (name.includes('sftp') || name.includes('collector')) return Database;
  if (name.includes('fdc')) return CheckCircle;
  if (name.includes('asn1') || name.includes('decoder')) return Activity;
  if (name.includes('ascii')) return FileText;
  if (name.includes('validation')) return Filter;
  if (name.includes('enrichment')) return AlertCircle;
  if (name.includes('encoder')) return RotateCcw;
  if (name.includes('diameter')) return Globe;
  if (name.includes('backup')) return Database;
  return Activity;
};

// Color mapping for different node types
const getNodeColor = (nodeName?: string) => {
  const name = (nodeName ?? '').toLowerCase();
  if (!name) return 'bg-blue-500';
  if (name.includes('sftp') || name.includes('collector')) return 'bg-blue-500';
  if (name.includes('fdc')) return 'bg-green-500';
  if (name.includes('asn1') || name.includes('decoder')) return 'bg-purple-500';
  if (name.includes('ascii')) return 'bg-yellow-500';
  if (name.includes('validation')) return 'bg-red-500';
  if (name.includes('enrichment')) return 'bg-orange-500';
  if (name.includes('encoder')) return 'bg-teal-500';
  if (name.includes('diameter')) return 'bg-indigo-500';
  if (name.includes('backup') || name.includes('raw')) return 'bg-gray-500';
  return 'bg-blue-500';
};

export function CollapsibleNodePalette({ 
  onAddNode, 
  isCollapsed: externalCollapsed, 
  onToggleCollapse 
}: CollapsibleNodePaletteProps) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Use external collapsed state if provided, otherwise use internal state
  const isCollapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  
  const handleToggleCollapse = () => {
    const newState = !isCollapsed;
    if (onToggleCollapse) {
      onToggleCollapse(newState);
    } else {
      setInternalCollapsed(newState);
    }
  };

  const fetchNodes = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching nodes...');
      const nodeList = await nodeService.getAllNodes();
      console.log('✅ Nodes fetched successfully:', nodeList);
      setNodes(nodeList);
    } catch (err) {
      console.error('❌ Error fetching nodes:', err);
      setError('Failed to load nodes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Node Library</h3>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="flex-1 p-4 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading nodes...</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-foreground">Node Library</h3>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-primary/10"
            title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="flex-1 p-4 flex flex-col items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive mb-2" />
            <p className="text-sm text-destructive mb-3 text-center">{error}</p>
            <Button 
              onClick={fetchNodes} 
              size="sm" 
              variant="outline"
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card/50 backdrop-blur-sm">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Node Library</h3>
            <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary border-primary/20">
              {nodes.length}
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleToggleCollapse}
          className="h-8 w-8 p-0 hover:bg-primary/10"
          title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {/* Content */}
      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-hidden">
          {nodes.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                No nodes available
              </p>
              <p className="text-xs text-muted-foreground">
                Create and deploy some nodes first to use them in flows
              </p>
            </div>
          ) : (
            <div className="space-y-3 h-full overflow-y-auto">
              {nodes.map((node) => {
                const Icon = getNodeIcon(node.name);
                const colorClass = getNodeColor(node.name);
                
                return (
                  <div
                    key={node.id}
                    className="group border border-border rounded-xl p-4 hover:bg-muted/30 hover:border-primary/30 transition-all duration-200 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md bg-card/30 backdrop-blur-sm"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/reactflow', node.id);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2.5 rounded-lg ${colorClass} text-white flex-shrink-0 shadow-sm`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate mb-1">
                            {node.name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>v{node.published_version?.version || node.versions?.[0]?.version || 1}</span>
                            <span>•</span>
                            <span>{node.versions?.length || 0} version{(node.versions?.length || 0) !== 1 ? 's' : ''}</span>
                            {node.is_deployed && (
                              <>
                                <span>•</span>
                                <Badge variant="outline" className="text-xs h-4 px-1 bg-success/10 text-success border-success/20">
                                  Deployed
                                </Badge>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddNode(node.id);
                        }}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                        title="Add to Canvas"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}