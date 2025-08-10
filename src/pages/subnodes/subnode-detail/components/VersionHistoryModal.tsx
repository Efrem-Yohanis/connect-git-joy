import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle, Clock, User } from "lucide-react";
import { SubnodeVersion } from "@/services/subnodeService";

interface VersionHistoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  versions: SubnodeVersion[];
  selectedVersion: SubnodeVersion | null;
  onSelectVersion: (version: SubnodeVersion) => void;
  onActivateVersion: (version: SubnodeVersion) => void;
  isLoading?: boolean;
}

export function VersionHistoryModal({
  open,
  onOpenChange,
  versions,
  selectedVersion,
  onSelectVersion,
  onActivateVersion,
  isLoading = false
}: VersionHistoryModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Version History</DialogTitle>
          <DialogDescription>
            Select a version to view its details, or activate a version to deploy it.
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
                  <TableHead>Comment</TableHead>
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
                      <Badge variant={version.is_deployed ? "default" : "outline"}>
                        v{version.version}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {version.is_deployed ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-green-700 font-medium">Deployed</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Draft</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{version.updated_by || 'Unknown'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(version.updated_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {version.version_comment || 'No comment'}
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
                        {!version.is_deployed && (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => onActivateVersion(version)}
                            disabled={isLoading}
                          >
                            Activate
                          </Button>
                        )}
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