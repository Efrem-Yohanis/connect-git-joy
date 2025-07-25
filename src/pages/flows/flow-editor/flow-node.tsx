import { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";

interface FlowNodeProps {
  data: {
    label: string;
    nodeType: string;
    deployed: boolean;
    subnodes?: any[];
    parameters?: any[];
  };
  selected: boolean;
}

export const FlowNode = memo(({ data, selected }: FlowNodeProps) => {
  return (
    <div 
      className={`
        bg-node-background border-2 rounded-lg p-4 min-w-[180px] shadow-node
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
            {data.deployed ? "Deployed" : "Not Deployed"}
          </Badge>
        </div>
        
        <p className="text-xs text-muted-foreground">{data.nodeType}</p>
        
        {data.subnodes && data.subnodes.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {data.subnodes.length} subnode{data.subnodes.length !== 1 ? 's' : ''}
          </div>
        )}
        
        {data.parameters && data.parameters.length > 0 && (
          <div className="text-xs text-muted-foreground">
            {data.parameters.length} parameter{data.parameters.length !== 1 ? 's' : ''}
          </div>
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