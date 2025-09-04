import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { nodeService } from '@/services/nodeService';
import { useState, useEffect } from 'react';
import { 
  Database, 
  Filter, 
  CheckCircle, 
  AlertCircle,
  RotateCcw,
  Activity,
  FileText,
  Globe,
  Plus
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading';

interface NodePaletteProps {
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

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      <Card className="bg-card border-border h-full">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Database className="h-5 w-5" />
            Available Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <LoadingSpinner size="lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-card border-border h-full">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Database className="h-5 w-5" />
            Available Nodes
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Database className="h-5 w-5" />
          Available Nodes
          <Badge variant="secondary" className="ml-auto">
            {nodes.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
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
          nodes.map((node) => {
            const Icon = getNodeIcon(node.name);
            const colorClass = getNodeColor(node.name);
            
            return (
              <div
                key={node.id}
                className="group border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-grab active:cursor-grabbing"
                draggable
                onDragStart={(event) => {
                  event.dataTransfer.setData('application/reactflow', node.id);
                  event.dataTransfer.effectAllowed = 'move';
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1">
                    <div className={`p-1.5 rounded ${colorClass} text-white flex-shrink-0`}>
                      <Icon className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {node.name}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        v{node.version} • {node.versions?.length || 0} version{(node.versions?.length || 0) !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onAddNode(node.id)}
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}