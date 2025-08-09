import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Download, 
  Trash2, 
  Edit,
  ExternalLink,
  History,
  ChevronDown,
  CheckCircle,
  Clock,
  User
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubnode, useSubnodeVersions, subnodeService } from "@/services/subnodeService";
import { toast } from "sonner";

export function SubnodeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showVersionDialog, setShowVersionDialog] = useState(false);
  const [versionsOpen, setVersionsOpen] = useState(false);
  
  const { data: subnode, loading, error, refetch } = useSubnode(id || '');
  const { data: versions, loading: versionsLoading, refetch: refetchVersions } = useSubnodeVersions(id || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading subnode...</p>
        </div>
      </div>
    );
  }

  if (error || !subnode) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Error loading subnode: {error}</p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/subnodes/${id}/edit`);
  };

  const handleCreateVersion = () => {
    navigate(`/subnodes/${id}/edit?version=new`);
    setShowVersionDialog(false);
  };

  const handleDelete = async () => {
    try {
      await subnodeService.deleteSubnode(id!);
      toast.success("Subnode deleted successfully");
      navigate('/subnodes');
    } catch (error) {
      toast.error("Failed to delete subnode");
      console.error("Delete error:", error);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(subnode, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${subnode.name}.json`;
    link.click();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">🧩 {subnode.name}</h1>
          <Badge variant="outline">v{subnode.version}</Badge>
          <Badge 
            variant={subnode.is_selected ? "default" : "outline"}
            className={subnode.is_selected ? "bg-green-500 text-white" : "text-muted-foreground"}
          >
            {subnode.is_selected ? "🟢 Selected" : "🔴 Not Selected"}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Subnode</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this subnode? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* SubNode Information */}
      <Card>
        <CardHeader>
          <CardTitle>SubNode Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold">Subnode ID</h4>
              <p className="text-muted-foreground font-mono text-sm">{subnode.id}</p>
            </div>
            <div>
              <h4 className="font-semibold">Parent Node ID</h4>
              <div className="flex items-center space-x-2">
                <p className="text-muted-foreground font-mono text-sm">{subnode.node}</p>
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
              <h4 className="font-semibold">Current Version</h4>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">v{subnode.version}</Badge>
                <Collapsible open={versionsOpen} onOpenChange={setVersionsOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 px-2">
                      <History className="h-3 w-3 mr-1" />
                      Version History
                      <ChevronDown className={`h-3 w-3 ml-1 transition-transform ${versionsOpen ? 'rotate-180' : ''}`} />
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Last Updated By</h4>
              <p className="text-muted-foreground">{subnode.last_updated_by || 'Unknown'}</p>
            </div>
            <div>
              <h4 className="font-semibold">Created Date</h4>
              <p className="text-muted-foreground">{formatDate(subnode.created_at)}</p>
            </div>
            <div>
              <h4 className="font-semibold">Last Modified Date</h4>
              <p className="text-muted-foreground">{formatDate(subnode.last_updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Version History Panel */}
      <Collapsible open={versionsOpen} onOpenChange={setVersionsOpen}>
        <CollapsibleContent className="space-y-4">
          <div className="border border-border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center space-x-2 mb-4">
              <History className="h-5 w-5" />
              <h3 className="font-semibold">Version History</h3>
            </div>
            
            {versionsLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                Loading versions...
              </div>
            ) : versions && versions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Version</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {versions.map((version) => (
                    <TableRow key={version.id}>
                      <TableCell>
                        <Badge variant={version.is_active ? "default" : "outline"}>
                          v{version.version}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {version.is_active ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-green-700 font-medium">Active</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Inactive</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{version.created_by}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(version.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {version.description || 'No description'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {!version.is_active ? (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={async () => {
                              try {
                                await subnodeService.activateVersion(id!, { version: version.version });
                                toast.success(`Version ${version.version} activated`);
                                refetch();
                                refetchVersions();
                              } catch (error) {
                                toast.error("Failed to activate version");
                              }
                            }}
                          >
                            Activate
                          </Button>
                        ) : (
                          <Badge variant="secondary" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No version history available
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Version Dialog */}
      <Dialog open={showVersionDialog} onOpenChange={setShowVersionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Version</DialogTitle>
            <DialogDescription>
              This SubNode is deployed. To make changes, a new version will be created. Continue?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowVersionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateVersion}>
              Create New Version
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}