import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SubnodeDetail, SubnodeVersion } from "@/services/subnodeService";
import { useNode } from "@/services/nodeService";

interface SubnodeInfoProps {
  subnode: SubnodeDetail;
  selectedVersion: SubnodeVersion | null;
}

export function SubnodeInfo({ subnode, selectedVersion }: SubnodeInfoProps) {
  const navigate = useNavigate();
  const { data: nodeData } = useNode(subnode.node);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subnode Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Node Name</h4>
            <div className="flex items-center space-x-2">
              <p className="font-medium">{nodeData?.name || subnode.node}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate(`/nodes/${subnode.node}`)}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Subnode ID</h4>
            <p className="font-mono text-sm bg-muted px-2 py-1 rounded">{subnode.id}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Active Version</h4>
            <p className="font-medium">{subnode.active_version || 'None'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Description</h4>
            <p className="text-sm">{subnode.description || 'No description'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Last Updated At</h4>
            <p className="text-sm">{selectedVersion ? formatDateTime(selectedVersion.updated_at) : 'N/A'}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-1">Last Updated By</h4>
            <p className="text-sm">{selectedVersion?.updated_by || 'Unknown'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}