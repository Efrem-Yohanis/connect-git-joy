import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { 
  Server, 
  Clock, 
  GitBranch, 
  Edit3, 
  Check, 
  X,
  Activity
} from "lucide-react";

interface GeneralInfoPanelProps {
  uptime: string;
  lastStartTimestamp: string;
  status: "running" | "stopped" | "error" | "partial";
  hosts: string[];
  currentRevision: string;
  baseRevision: string;
  description: string;
}

export function GeneralInfoPanel({ 
  uptime, 
  lastStartTimestamp, 
  status, 
  hosts, 
  currentRevision, 
  baseRevision, 
  description 
}: GeneralInfoPanelProps) {
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(description);

  const handleSaveDescription = () => {
    // TODO: Implement save logic
    setIsEditingDescription(false);
  };

  const handleCancelEdit = () => {
    setEditedDescription(description);
    setIsEditingDescription(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-success/10 text-success border-success/20";
      case "stopped": return "bg-muted text-muted-foreground border-border";
      case "error": return "bg-destructive/10 text-destructive border-destructive/20";
      case "partial": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          General Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Badge className={getStatusColor(status)}>
              <span className="capitalize">{status}</span>
            </Badge>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Uptime</label>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-mono">{uptime}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Last Started</label>
            <p className="text-sm font-mono">2024-01-12 23:15:30</p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Host Count</label>
            <p className="text-sm font-semibold">2 hosts</p>
          </div>
        </div>

        {/* Hosts */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Server className="h-4 w-4" />
            Hosts
          </label>
          <div className="flex flex-wrap gap-2">
            {hosts.map((host, index) => (
              <Badge key={index} variant="outline" className="font-mono">
                {host}
              </Badge>
            ))}
          </div>
        </div>

        {/* Version Info */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <GitBranch className="h-4 w-4" />
            Version Information
          </label>
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Current: </span>
              <span className="font-mono font-medium">v2</span>
            </div>
            <div>
              <span className="text-muted-foreground">Based on: </span>
              <span className="font-mono font-medium">v1</span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-primary">
              Compare versions
            </Button>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center justify-between">
            Description
            {!isEditingDescription && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditingDescription(true)}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
          </label>
          
          {isEditingDescription ? (
            <div className="space-y-2">
              <Textarea
                value={editedDescription}
                onChange={(e) => setEditedDescription(e.target.value)}
                placeholder="Enter stream description..."
                className="min-h-[80px]"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveDescription}>
                  <Check className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md">
              {description || "No description available"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}