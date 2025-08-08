import { memo, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Database, ChevronDown, Play, Square, Settings, CheckCircle } from "lucide-react";
import { subnodeService } from "@/services/subnodeService";
import { toast } from "sonner";

interface SftpCollectorNodeProps {
  data: {
    label: string;
    description?: string;
    parameters?: any;
    subnodes?: Array<{
      id: string;
      name: string;
      version?: number;
      is_selected?: boolean;
      last_updated_at?: string;
      parameters?: Array<{
        id: string;
        key: string;
        default_value: string;
        required: boolean;
      }>;
    }>;
  };
  selected: boolean;
}

export const SftpCollectorNode = memo(({ data, selected }: SftpCollectorNodeProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div 
      className={`
        bg-node-background border-2 rounded-lg p-4 min-w-[200px] shadow-node relative
        ${selected ? 'border-primary' : 'border-node-border'}
        transition-all duration-200
      `}
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
            <Database className="w-3 h-3 text-white" />
          </div>
          <h3 className="font-medium text-sm">{data.label}</h3>
        </div>
        
        {data.description && (
          <p className="text-xs text-muted-foreground">{data.description}</p>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              SFTP Collector
            </Badge>
            {data.subnodes && (
              <Badge variant="secondary" className="text-xs">
                {data.subnodes.length} subnodes
              </Badge>
            )}
          </div>
          {data.subnodes && data.subnodes.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <ChevronDown 
                className={`w-3 h-3 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`} 
              />
            </button>
          )}
        </div>

        {isDropdownOpen && data.subnodes && data.subnodes.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-md shadow-lg z-20 mt-1 min-w-[320px]">
            {data.subnodes.map((subnode) => (
              <div key={subnode.id} className="p-3 hover:bg-muted border-b border-border last:border-b-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">{subnode.name}</div>
                      <div className="text-xs text-muted-foreground">
                        v{subnode.version || 1} • {subnode.parameters?.length || 0} params
                        {subnode.last_updated_at && (
                          <span className="ml-1">• Updated {new Date(subnode.last_updated_at).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Badge 
                        variant={subnode.is_selected ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {subnode.is_selected ? "Selected" : "Available"}
                      </Badge>
                      {subnode.is_selected && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(`/subnodes/${subnode.id}/edit`, '_blank');
                      }}
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-6 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Navigate to subnode detail page
                        window.open(`/subnodes/${subnode.id}`, '_blank');
                      }}
                    >
                      <Settings className="w-3 h-3" />
                    </Button>
                  </div>

                  {subnode.parameters && subnode.parameters.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-border">
                      <div className="text-xs text-muted-foreground mb-1">Parameters:</div>
                      <div className="space-y-1 max-h-20 overflow-y-auto">
                        {subnode.parameters.slice(0, 3).map((param: any) => (
                          <div key={param.id} className="text-xs flex justify-between items-center">
                            <span className="font-mono font-medium">{param.key}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-muted-foreground truncate max-w-20" title={param.default_value}>
                                {param.default_value}
                              </span>
                              {param.required && (
                                <span className="text-red-500">*</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {subnode.parameters.length > 3 && (
                          <div className="text-xs text-muted-foreground">
                            +{subnode.parameters.length - 3} more parameters...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <Handle 
        type="target" 
        position={Position.Left} 
        className="!bg-primary !border-background !w-3 !h-3" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="!bg-primary !border-background !w-3 !h-3" 
      />
    </div>
  );
});