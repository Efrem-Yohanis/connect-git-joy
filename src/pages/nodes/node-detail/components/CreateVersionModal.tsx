import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface CreateVersionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateVersion: (changelog: string) => void;
  isLoading?: boolean;
}

export function CreateVersionModal({
  open,
  onOpenChange,
  onCreateVersion,
  isLoading = false
}: CreateVersionModalProps) {
  const [changelog, setChangelog] = useState("");

  const handleSubmit = () => {
    onCreateVersion(changelog);
    setChangelog("");
  };

  const handleCancel = () => {
    setChangelog("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
          <DialogDescription>
            This will create a new editable version. 
            You can then edit the parameters and deploy it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="version-changelog">Version Comment</Label>
            <Textarea
              id="version-changelog"
              placeholder="Enter a comment for this version..."
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !changelog.trim()}>
            Create Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}