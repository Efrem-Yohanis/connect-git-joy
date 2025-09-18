import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { nodeService } from '@/services/nodeService';
import { useEffect } from 'react';
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
  if (name.includes('backup')) return 'bg-gray-500';
  return 'bg-blue-500';
};

export function CollapsibleNodePalette({ onAddNode }: CollapsibleNodePaletteProps) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const fetchNodes = async () => {
    try {
      setLoading(true);
      const nodeList = await nodeService.getAllNodes();
      setNodes(nodeList);
      setError(null);
    } catch (err) {
      setError('Failed to load nodes');
      console.error('Error fetching nodes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodes();
  }, []);

  if (loading) {
    return (
      <div className={`bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold">Available Nodes</h3>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="p-4">
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <h3 className="font-semibold">Available Nodes</h3>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
        {!isCollapsed && (
          <div className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-destructive">{error}</p>
              <Button 
                onClick={fetchNodes} 
                size="sm" 
                variant="outline"
                className="text-xs"
              >
                Retry
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            <h3 className="font-semibold">Available Nodes</h3>
            <Badge variant="secondary" className="ml-auto">
              {nodes.length}
            </Badge>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8 p-0"
          title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {!isCollapsed && (
        <div className="flex-1 p-4 overflow-hidden">
          {nodes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No nodes available
              </p>
              <p className="text-xs text-muted-foreground mt-1">
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
                    className="group border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md"
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData('application/reactflow', node.id);
                      event.dataTransfer.effectAllowed = 'move';
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 flex-1">
                        <div className={`p-2 rounded-lg ${colorClass} text-white flex-shrink-0`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-foreground truncate">
                            {node.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            v{node.version} • {node.versions?.length || 0} version{(node.versions?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => onAddNode(node.id)}
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