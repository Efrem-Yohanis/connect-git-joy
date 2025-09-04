import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Node, NodeVersionDetail } from "@/services/nodeService";

interface NodeSummaryProps {
  node: Node;
  selectedVersion: NodeVersionDetail | null;
  propertiesCount: number;
  subnodesCount: number;
}

export function NodeSummary({ 
  node, 
  selectedVersion, 
  propertiesCount, 
  subnodesCount 
}: NodeSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Node Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Description</span>
              <p className="mt-1 text-sm">
                {node.description || "No description available"}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-muted-foreground">Properties</span>
              <p className="mt-1 text-sm font-semibold">{propertiesCount}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-muted-foreground">Subnodes</span>
              <p className="mt-1 text-sm font-semibold">{subnodesCount}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <span className="text-sm font-medium text-muted-foreground">Last Updated By</span>
              <p className="mt-1 text-sm">{node.created_by || "Unknown"}</p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-muted-foreground">Last Updated Date</span>
              <p className="mt-1 text-sm">
                {new Date(node.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div>
              <span className="text-sm font-medium text-muted-foreground">Node ID</span>
              <p className="mt-1 text-sm font-mono">{node.id}</p>
            </div>
            
          </div>
        </div>
      </CardContent>
    </Card>
  );
}