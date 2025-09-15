import React, { useState } from 'react';
import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface FlowNodeProps {
  data: {
    label: string;
    nodeType?: string;
    deployed?: boolean;
    subnodes?: any[];
    parameters?: any[];
    description?: string;
    version?: number;
  };
  selected: boolean;
}

export const FlowNode = memo(({ data, selected }: FlowNodeProps) => {
  const [isSubnodesOpen, setIsSubnodesOpen] = useState(false);

  return (
    <div 
      className={`
        bg-node-background border-2 p-4 min-w-[200px] shadow-node
        ${selected ? 'border-primary' : 'border-node-border'}
        ${data.deployed ? 'shadow-[0_0_0_2px_hsl(var(--node-deployed))]' : ''}
        transition-all duration-200
      `}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-edge-default !border-edge-default !w-3 !h-3" 
      />
      
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm truncate">{data.label}</h3>
          <Badge 
            variant={data.deployed ? "default" : "outline"}
            className={`text-xs ${data.deployed ? 'bg-node-deployed text-white' : 'text-node-undeployed border-node-undeployed'}`}
          >
            {data.deployed ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <div className="text-xs text-muted-foreground">
          {data.nodeType && <div>Type: {data.nodeType.replace('_', ' ')}</div>}
          {data.version && <div>Version: {data.version}</div>}
        </div>
        
        {data.description && (
          <div className="text-xs text-muted-foreground">{data.description}</div>
        )}

        {data.subnodes && data.subnodes.length > 0 && (
          <div className="mt-2">
            <Collapsible open={isSubnodesOpen} onOpenChange={setIsSubnodesOpen}>
              <CollapsibleTrigger className="flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors w-full">
                <ChevronDown className={`h-3 w-3 mr-1 transition-transform ${isSubnodesOpen ? 'rotate-180' : ''}`} />
                {data.subnodes.length} Subnode{data.subnodes.length > 1 ? 's' : ''}
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1 space-y-1">
                {data.subnodes.map((subnode: any) => (
                  <div key={subnode.id} className="text-xs p-2 bg-background/50 rounded border text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <div className="font-medium truncate">{subnode.name}</div>
                      <Badge variant={subnode.is_selected ? "default" : "secondary"} className="text-[10px] px-1">
                        {subnode.is_selected ? "Selected" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      Version {subnode.version}
                    </div>
                    {subnode.parameters && subnode.parameters.length > 0 && (
                      <div className="text-[10px] text-muted-foreground mt-1">
                        {subnode.parameters.length} parameter{subnode.parameters.length > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        )}

        {(!data.subnodes || data.subnodes.length === 0) && (
          <div className="text-xs text-muted-foreground/60">No subnodes</div>
        )}
      </div>
      
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-edge-default !border-edge-default !w-3 !h-3" 
      />
    </div>
  );
});

FlowNode.displayName = 'FlowNode';