import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Trash2, Play, Copy, Plus, Square, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import { subnodeService } from '@/services/subnodeService';
import { flowService } from '@/services/flowService';
import { toast } from 'sonner';

interface PropertiesPanelProps {
  selectedNode: Node | null;
  onUpdateNode: (nodeId: string, data: any) => void;
  onDeleteNode: (nodeId: string) => void;
  flowId?: string; // Add flowId for API calls
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface Subnode {
  id: string;
  name: string;
  version?: number;
  parameters?: any[];
}

export function PropertiesPanel({ 
  selectedNode, 
  onUpdateNode, 
  onDeleteNode, 
  flowId, 
  isCollapsed = false,
  onToggleCollapse 
}: PropertiesPanelProps) {
  const [availableSubnodes, setAvailableSubnodes] = useState<Subnode[]>([]);
  const [loadingSubnodes, setLoadingSubnodes] = useState(false);

  // Fetch subnodes for the selected node - MUST be before early return
  useEffect(() => {
    if (selectedNode?.data?.nodeId) {
      setLoadingSubnodes(true);
      // Filter subnodes by node ID from the global subnodes list
      subnodeService.getAllSubnodes()
        .then(allSubnodes => {
          const nodeSubnodes = allSubnodes.results.filter(subnode => subnode.node_family === selectedNode.data.nodeId);
          setAvailableSubnodes(nodeSubnodes);
        })
        .catch(error => {
          console.error('Error fetching subnodes:', error);
          toast.error('Failed to load subnodes');
        })
        .finally(() => {
          setLoadingSubnodes(false);
        });
    } else {
      setAvailableSubnodes([]);
    }
  }, [selectedNode?.data?.nodeId]);

  if (!selectedNode) {
    return (
      <div className={`bg-card border-l border-border shadow-sm transition-all duration-300 ${
        isCollapsed ? 'w-12' : 'w-80'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <h3 className="font-semibold">Properties</h3>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
              title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
            >
              {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center p-6">
              <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No Node Selected</h3>
              <p className="text-sm text-muted-foreground">
                Click on a node to view and edit its properties
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }

  const handleSubnodeSelection = async (subnodeId: string) => {
    if (!selectedNode?.data) return;
    
    const selectedSubnode = availableSubnodes.find(sub => sub.id === subnodeId);
    
    // Optimistically update UI first
    onUpdateNode(selectedNode.id, {
      ...(selectedNode.data as Record<string, any>),
      selectedSubnode: selectedSubnode,
      subnodeId: subnodeId,
    });
    
    // Make real-time API call if flowId is provided
    if (flowId && selectedNode.data?.nodeId) {
      try {
        await flowService.setFlowNodeSubnode(String(selectedNode.data.nodeId), subnodeId);
        console.log('✅ Subnode selection updated successfully via API');
        toast.success(`Subnode "${selectedSubnode?.name}" selected successfully`);
      } catch (error) {
        console.error('❌ Error updating subnode selection:', error);
        toast.error('Failed to update subnode selection');
        
        // Revert optimistic update on error
        onUpdateNode(selectedNode.id, {
          ...(selectedNode.data as Record<string, any>),
          selectedSubnode: undefined,
          subnodeId: undefined,
        });
      }
    }
  };

  const handleLabelChange = (value: string) => {
    // Label is now read-only, this function is kept for compatibility
    console.log('Label change attempted (read-only):', value);
  };

  const handleDescriptionChange = (value: string) => {
    if (!selectedNode?.data) return;
    onUpdateNode(selectedNode.id, {
      ...(selectedNode.data as Record<string, any>),
      description: value,
    });
  };

  // Remove parameter handlers since parameters section is removed

  return (
    <div className={`bg-card border-l border-border shadow-sm transition-all duration-300 ${
      isCollapsed ? 'w-12' : 'w-80'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <h2 className="font-semibold text-foreground">Node Properties</h2>
            <Badge variant="secondary" className="text-xs">
              {selectedNode.type}
            </Badge>
          </div>
        )}
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0"
            title={isCollapsed ? "Expand Panel" : "Collapse Panel"}
          >
            {isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b border-border">
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Play className="w-3 h-3 mr-1" />
                Test
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Copy className="w-3 h-3 mr-1" />
                Clone
              </Button>
              <Button 
                size="sm" 
                variant="destructive" 
                onClick={() => onDeleteNode(selectedNode.id)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
        {/* Basic Properties */}
        <div className="space-y-4">
          <h3 className="font-medium text-foreground">Basic Properties</h3>
          
          <div className="space-y-2">
            <Label htmlFor="label">Label</Label>
            <Input
              id="label"
              value={String(selectedNode.data?.label || '')}
              readOnly
              placeholder="Node label"
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={String(selectedNode.data?.description || '')}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              placeholder="Optional description"
              className="min-h-20"
            />
          </div>
        </div>

        <Separator />

        {/* Subnode Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Subnode Selection</h3>
          </div>

          {loadingSubnodes ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Loading subnodes...
            </div>
          ) : availableSubnodes.length > 0 ? (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="subnode-select">Select Subnode</Label>
                <Select 
                  value={String(selectedNode.data?.subnodeId || "")} 
                  onValueChange={handleSubnodeSelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a subnode for this flow" />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] bg-popover border border-border shadow-lg">
                    {availableSubnodes.map((subnode) => (
                      <SelectItem key={subnode.id} value={subnode.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{subnode.name}</span>
                          <Badge variant="secondary" className="ml-2 text-xs">
                            v{subnode.version || 1}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {selectedNode.data?.selectedSubnode && (
                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{(selectedNode.data.selectedSubnode as Subnode).name}</div>
                      <div className="text-xs text-muted-foreground">
                        v{(selectedNode.data.selectedSubnode as Subnode).version || 1} • {(selectedNode.data.selectedSubnode as Subnode).parameters?.length || 0} params
                      </div>
                    </div>
                    <Badge variant="default" className="text-xs">
                      Selected
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs flex-1"
                      onClick={() => window.open(`/subnodes/${(selectedNode.data.selectedSubnode as Subnode).id}/edit`, '_blank')}
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={() => window.open(`/subnodes/${(selectedNode.data.selectedSubnode as Subnode).id}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4 text-muted-foreground text-sm">
              No subnodes available for this node
            </div>
          )}
        </div>


         {/* Node Info */}
         <div className="space-y-2">
           <h3 className="font-medium text-foreground">Node Info</h3>
           <div className="text-sm text-muted-foreground space-y-1">
             <div>ID: <code className="text-xs bg-muted px-1 rounded">{selectedNode.id}</code></div>
             <div>Position: {Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)}</div>
             <div>Type: {selectedNode.type}</div>
           </div>
         </div>
          </div>
        </>
      )}
    </div>
  );
}