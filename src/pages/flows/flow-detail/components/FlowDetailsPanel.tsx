import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FlowDetailsData {
  id: string;
  name: string;
  description: string;
  nodes?: Array<any>;
  updated_at: string;
  updated_by?: string;
  created_by: string;
}

interface FlowDetailsPanelProps {
  flow: FlowDetailsData;
}

export function FlowDetailsPanel({ flow }: FlowDetailsPanelProps) {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const nodeCount = flow.nodes?.length || 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Flow Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Description</h4>
            <p className="text-sm">{flow.description || 'No description available'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Nodes</h4>
            <p className="font-medium">{nodeCount}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Last Updated By</h4>
            <p className="text-sm">{flow.updated_by || flow.created_by || 'Unknown'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Last Updated Date</h4>
            <p className="text-sm">{formatDateTime(flow.updated_at)}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Flow ID</h4>
            <p className="font-mono text-xs bg-muted px-2 py-1 rounded">{flow.id}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}