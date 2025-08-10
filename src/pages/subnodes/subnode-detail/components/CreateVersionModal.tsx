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
  onCreateVersion: (comment: string) => void;
  isLoading?: boolean;
}

export function CreateVersionModal({
  open,
  onOpenChange,
  onCreateVersion,
  isLoading = false
}: CreateVersionModalProps) {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    onCreateVersion(comment);
    setComment("");
  };

  const handleCancel = () => {
    setComment("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Version</DialogTitle>
          <DialogDescription>
            This will create a new editable version based on the current active version. 
            You can then edit the parameter values and deploy it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="version-comment">Version Comment</Label>
            <Textarea
              id="version-comment"
              placeholder="Enter a comment for this version..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !comment.trim()}>
            Create Version
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}