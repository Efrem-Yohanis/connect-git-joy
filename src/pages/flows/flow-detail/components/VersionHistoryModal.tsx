import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, User, MoreVertical, Download, Copy, Trash2 } from "lucide-react";
import { FlowVersion } from "@/services/flowService";

interface VersionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: FlowVersion[];
  selectedVersion: FlowVersion | null;
  onSelectVersion: (version: FlowVersion) => void;
  onActivateVersion: (version: FlowVersion) => void;
  onExportVersion: (version: FlowVersion) => void;
  onCloneVersion: (version: FlowVersion) => void;
  onDeleteVersion: (version: FlowVersion) => void;
  isLoading?: boolean;
}

export function VersionHistoryModal({
  open,
  onOpenChange,
  versions,
  selectedVersion,
  onSelectVersion,
  onActivateVersion,
  onExportVersion,
  onCloneVersion,
  onDeleteVersion,
  isLoading = false
}: VersionHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Manage flow versions. Select a version to view its details, activate a version to make it current, or use the actions menu for additional options.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {versions.length > 0 ? (
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
                  <TableRow 
                    key={version.id}
                    className={selectedVersion?.id === version.id ? "bg-muted/50" : ""}
                  >
                    <TableCell>
                      <Badge variant={version.is_active ? "default" : "outline"}>
                        v{version.version}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {version.is_active ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-success font-medium">Active</span>
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
                        <span>{version.created_by || 'Unknown'}</span>
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
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => onSelectVersion(version)}
                          disabled={isLoading}
                        >
                          {selectedVersion?.id === version.id ? 'Selected' : 'View'}
                        </Button>
                        {!version.is_active && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => onActivateVersion(version)}
                            disabled={isLoading}
                          >
                            Activate
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={isLoading}
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onExportVersion(version)} disabled={isLoading}>
                              <Download className="h-4 w-4 mr-2" />
                              Export Version
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onCloneVersion(version)} disabled={isLoading}>
                              <Copy className="h-4 w-4 mr-2" />
                              Clone Version
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteVersion(version)} 
                              disabled={isLoading || version.is_active}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Version
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No version history available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}