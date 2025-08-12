import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Subnode {
  id: string;
  name: string;
  description: string;
  node: string;
  active_version: number | null;
  original_version: number;
  version_comment: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  versions: any[];
}

interface SubnodesSectionProps {
  subnodes: Subnode[];
}

export function SubnodesSection({ subnodes }: SubnodesSectionProps) {
  const navigate = useNavigate();

  console.log('🔍 SubnodesSection received subnodes:', subnodes);
  console.log('🔍 SubnodesSection subnodes length:', subnodes.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subnodes ({subnodes.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {subnodes.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subnode Name</TableHead>
                <TableHead>Active Version</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated By</TableHead>
                <TableHead>Last Updated Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subnodes.map((subnode) => (
                <TableRow key={subnode.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{subnode.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {subnode.active_version ? `v${subnode.active_version}` : 'No Active Version'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={subnode.active_version ? "default" : "secondary"}>
                      {subnode.active_version ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{subnode.updated_by || "Unknown"}</TableCell>
                  <TableCell>
                    {new Date(subnode.updated_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => navigate(`/subnodes/${subnode.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No subnodes available for this node.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}