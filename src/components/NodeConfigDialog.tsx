import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface NodeData {
  label: string;
  description: string;
  config?: Record<string, any>;
  connector?: string;
  connectorOptions?: string[];
}

interface NodeConfigDialogProps {
  nodeId: string;
  nodeData: NodeData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (nodeId: string, config: Record<string, any>) => void;
}

export function NodeConfigDialog({
  nodeId,
  nodeData,
  isOpen,
  onClose,
  onSave,
}: NodeConfigDialogProps) {
  const [config, setConfig] = useState(nodeData.config || {});
  const [label, setLabel] = useState(nodeData.label);
  const [description, setDescription] = useState(nodeData.description);

  const handleSave = () => {
    onSave(nodeId, {
      ...config,
      label,
      description,
    });
    onClose();
  };

  const handleConfigChange = (key: string, value: string) => {
    setConfig(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const addConfigField = () => {
    const key = `config_${Object.keys(config).length + 1}`;
    setConfig(prev => ({
      ...prev,
      [key]: '',
    }));
  };

  const removeConfigField = (key: string) => {
    setConfig(prev => {
      const newConfig = { ...prev };
      delete newConfig[key];
      return newConfig;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-background border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Configure Node</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Update the configuration for this node.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="label" className="text-foreground">Label</Label>
            <Input
              id="label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="bg-background border-input text-foreground"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-input text-foreground"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-foreground">Configuration</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addConfigField}
                className="border-input text-foreground"
              >
                Add Field
              </Button>
            </div>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {Object.entries(config).map(([key, value]) => (
                <div key={key} className="flex gap-2 items-center">
                  <Input
                    placeholder="Key"
                    value={key}
                    onChange={(e) => {
                      const newKey = e.target.value;
                      const newConfig = { ...config };
                      delete newConfig[key];
                      newConfig[newKey] = value;
                      setConfig(newConfig);
                    }}
                    className="flex-1 bg-background border-input text-foreground"
                  />
                  <Input
                    placeholder="Value"
                    value={String(value)}
                    onChange={(e) => handleConfigChange(key, e.target.value)}
                    className="flex-1 bg-background border-input text-foreground"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeConfigField(key)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              {Object.keys(config).length === 0 && (
                <p className="text-sm text-muted-foreground">No configuration fields. Click "Add Field" to add one.</p>
              )}
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-input text-foreground">
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Configuration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}