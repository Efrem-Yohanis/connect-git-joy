import { useState } from "react";
import { Download, Settings, Trash2, ArrowRight, Grid2X2, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for edges
const mockEdges = [
  {
    id: "1",
    sourceNode: "Database Source",
    targetNode: "Data Transform",
    edgeType: "data_flow",
    flowName: "Data Processing Pipeline",
  },
  {
    id: "2", 
    sourceNode: "Data Transform",
    targetNode: "File Output",
    edgeType: "data_flow",
    flowName: "Data Processing Pipeline",
  },
  {
    id: "3",
    sourceNode: "Database Source",
    targetNode: "Analytics Engine",
    edgeType: "control",
    flowName: "ETL Workflow",
  },
];

export function EdgesPage() {
  const [edges] = useState(mockEdges);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredEdges = edges.filter(edge =>
    edge.sourceNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edge.targetNode.toLowerCase().includes(searchTerm.toLowerCase()) ||
    edge.flowName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEdgeTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      data_flow: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      control: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      trigger: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    };
    return colors[type] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Search edges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex border border-border rounded-md">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEdges.map((edge) => (
            <Card key={edge.id} className="bg-card border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-foreground text-sm flex items-center justify-between">
                  Connection
                  <Badge className={getEdgeTypeBadge(edge.edgeType)}>
                    {edge.edgeType.replace('_', ' ')}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <div className="text-sm font-medium text-foreground">{edge.sourceNode}</div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-medium text-foreground">{edge.targetNode}</div>
                </div>
                
                <div className="text-center">
                  <Badge variant="outline">{edge.flowName}</Badge>
                </div>
                
                <div className="pt-2 border-t border-border">
                  <div className="text-xs font-medium text-foreground mb-2">Actions:</div>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="sm">
                      <Settings className="h-3 w-3 mr-1" />
                      Settings
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-3 w-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source Node</TableHead>
                <TableHead>Connection</TableHead>
                <TableHead>Target Node</TableHead>
                <TableHead>Edge Type</TableHead>
                <TableHead>Flow Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEdges.map((edge) => (
                <TableRow key={edge.id}>
                  <TableCell className="font-medium">{edge.sourceNode}</TableCell>
                  <TableCell className="text-center">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                  <TableCell className="font-medium">{edge.targetNode}</TableCell>
                  <TableCell>
                    <Badge className={getEdgeTypeBadge(edge.edgeType)}>
                      {edge.edgeType.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{edge.flowName}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}