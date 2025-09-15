import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Database, 
  CheckCircle, 
  AlertCircle,
  RotateCcw,
  Activity,
  FileText,
  Globe,
  Filter,
  ChevronDown
} from "lucide-react";

interface EnhancedFlowNodeProps {
  data: {
    label: string;
    description?: string;
    nodeId?: string;
    flowNodeId?: string;
    selectedSubnode?: string;
    subnodes?: Array<{
      id: string;
      name: string;
      description?: string;
    }>;
    onSubnodeChange?: (nodeId: string, subnodeId: string) => void;
  };
  selected: boolean;
  id: string;
}

// Icon mapping for different node types
const getNodeIcon = (nodeName?: string) => {
  const name = (nodeName ?? '').toLowerCase();
  if (!name) return Activity;
  if (name.includes('sftp') || name.includes('collector')) return Database;
  if (name.includes('fdc')) return CheckCircle;
  if (name.includes('asn1') || name.includes('decoder')) return Activity;
  if (name.includes('ascii')) return FileText;
  if (name.includes('validation')) return Filter;
  if (name.includes('enrichment')) return AlertCircle;
  if (name.includes('encoder')) return RotateCcw;
  if (name.includes('diameter')) return Globe;
  if (name.includes('backup')) return Database;
  return Activity;
};

// Color mapping for different node types
const getNodeColor = (nodeName?: string) => {
  const name = (nodeName ?? '').toLowerCase();
  if (!name) return 'bg-blue-500';
  if (name.includes('sftp') || name.includes('collector')) return 'bg-blue-500';
  if (name.includes('fdc')) return 'bg-green-500';
  if (name.includes('asn1') || name.includes('decoder')) return 'bg-purple-500';
  if (name.includes('ascii')) return 'bg-yellow-500';
  if (name.includes('validation')) return 'bg-red-500';
  if (name.includes('enrichment')) return 'bg-orange-500';
  if (name.includes('encoder')) return 'bg-teal-500';
  if (name.includes('diameter')) return 'bg-indigo-500';
  if (name.includes('backup')) return 'bg-gray-500';
  return 'bg-blue-500';
};

export const EnhancedFlowNode = memo(({ data, selected, id }: EnhancedFlowNodeProps) => {
  const Icon = getNodeIcon(data.label);
  const colorClass = getNodeColor(data.label);
  
  // Node status - for now we'll use "Active" as default, but this could come from data
  const nodeStatus = "Active"; // This could be "Active" or "Drafted"
  
  const handleSubnodeChange = (subnodeId: string) => {
    if (data.onSubnodeChange) {
      data.onSubnodeChange(id, subnodeId);
    }
  };

  return (
    <div 
      className={`
        bg-card border-2 rounded-lg p-4 min-w-[250px] shadow-lg relative
        ${selected ? 'border-primary shadow-primary/20' : 'border-border'}
        transition-all duration-200 hover:shadow-xl
      `}
    >
      {/* Visible connection handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-primary !border-primary !w-3 !h-3 !border-2 !border-background"
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-primary !border-primary !w-3 !h-3 !border-2 !border-background"
      />

      <div className="space-y-3">
        {/* Node Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded ${colorClass} flex items-center justify-center`}>
              <Icon className="w-3 h-3 text-white" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">{data.label}</h3>
          </div>
          
          {/* Node Status Badge */}
          <Badge 
            variant={nodeStatus === "Active" ? "default" : "secondary"}
            className="text-xs"
          >
            {nodeStatus}
          </Badge>
        </div>

        {/* Subnode Selection Dropdown */}
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground font-medium">Subnode</div>
          <Select 
            value={data.selectedSubnode || "none"} 
            onValueChange={(value) => handleSubnodeChange(value === "none" ? "" : value)}
          >
            <SelectTrigger className="w-full text-xs h-8">
              <SelectValue placeholder="Select subnode" />
            </SelectTrigger>
            <SelectContent className="z-50">
              <SelectItem value="none" className="text-xs">
                No subnode selected
              </SelectItem>
              {data.subnodes?.map((subnode) => (
                <SelectItem key={subnode.id} value={subnode.id} className="text-xs">
                  {subnode.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Subnode Display */}
        {data.selectedSubnode && data.subnodes && (
          <div className="pt-2 border-t border-border">
            <div className="text-xs text-muted-foreground">Selected:</div>
            <div className="text-xs font-medium text-foreground">
              {data.subnodes.find(s => s.id === data.selectedSubnode)?.name || data.selectedSubnode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

EnhancedFlowNode.displayName = 'EnhancedFlowNode';