import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Save, 
  RotateCcw, 
  AlertTriangle,
  Activity,
  Zap,
  Archive
} from "lucide-react";
import { useState } from "react";

interface ExecutionSettingsProps {
  currentSettings?: {
    executionPriority: string;
    diagnosticLevel: string;
    heartbeatMode: string;
    bufferThreshold: number;
    autoDiscard: boolean;
    compression: boolean;
  };
}

export function ExecutionSettings({ 
  currentSettings = {
    executionPriority: "normal",
    diagnosticLevel: "application",
    heartbeatMode: "standard",
    bufferThreshold: 80,
    autoDiscard: true,
    compression: false
  }
}: ExecutionSettingsProps) {
  const [settings, setSettings] = useState(currentSettings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // TODO: Implement save logic
    console.log("Saving settings:", settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    setSettings(currentSettings);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Execution Settings
          </div>
          {hasChanges && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Execution Priority */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Zap className="h-4 w-4" />
            Default Execution Priority
          </Label>
          <Select 
            value={settings.executionPriority} 
            onValueChange={(value) => handleSettingChange("executionPriority", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="normal">Normal Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="critical">Critical Priority</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Higher priority streams get more system resources
          </p>
        </div>

        <Separator />

        {/* Diagnostic Settings */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <Activity className="h-4 w-4" />
            Diagnostic Configuration
          </Label>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm">Internal Level</Label>
              <Select 
                value={settings.diagnosticLevel} 
                onValueChange={(value) => handleSettingChange("diagnosticLevel", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="error">Error Only</SelectItem>
                  <SelectItem value="warning">Warning & Error</SelectItem>
                  <SelectItem value="info">Info, Warning & Error</SelectItem>
                  <SelectItem value="debug">All (Debug Mode)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Application Level</Label>
              <Select defaultValue="application">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="error">Error Only</SelectItem>
                  <SelectItem value="warning">Warning & Error</SelectItem>
                  <SelectItem value="application">Application Level</SelectItem>
                  <SelectItem value="debug">All (Debug Mode)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm">Library Level</Label>
              <Select defaultValue="error">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="off">Off</SelectItem>
                  <SelectItem value="error">Error Only</SelectItem>
                  <SelectItem value="warning">Warning & Error</SelectItem>
                  <SelectItem value="info">Info, Warning & Error</SelectItem>
                  <SelectItem value="debug">All (Debug Mode)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Heartbeat Settings */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2 text-sm font-medium">
            <AlertTriangle className="h-4 w-4" />
            Heartbeat Reaction Mode
          </Label>
          <Select 
            value={settings.heartbeatMode} 
            onValueChange={(value) => handleSettingChange("heartbeatMode", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ignore">Ignore</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="aggressive">Aggressive</SelectItem>
              <SelectItem value="immediate">Immediate</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            How the system responds to missed heartbeats from nodes
          </p>
        </div>

        <Separator />

        {/* Buffer Settings */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Node Buffer Threshold (%)</Label>
          <div className="flex items-center gap-4">
            <Input
              type="number" 
              min="0" 
              max="100"
              value={settings.bufferThreshold}
              onChange={(e) => handleSettingChange("bufferThreshold", parseInt(e.target.value))}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">
              Trigger alerts when buffer exceeds this percentage
            </span>
          </div>
        </div>

        <Separator />

        {/* Toggle Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="flex items-center gap-2 text-sm font-medium">
                <Archive className="h-4 w-4" />
                Auto-discard Failed Events
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically discard events after maximum retry attempts
              </p>
            </div>
            <Switch
              checked={settings.autoDiscard}
              onCheckedChange={(checked) => handleSettingChange("autoDiscard", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Enable Compression</Label>
              <p className="text-xs text-muted-foreground">
                Compress data during processing to save bandwidth
              </p>
            </div>
            <Switch
              checked={settings.compression}
              onCheckedChange={(checked) => handleSettingChange("compression", checked)}
            />
          </div>
        </div>

        {hasChanges && (
          <div className="bg-warning/10 border border-warning/20 p-3">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Unsaved Changes</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              You have unsaved changes. Click "Save Changes" to apply them.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}