import React from 'react';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, Activity, FileText, Filter, AlertCircle, RotateCcw, Globe, Plus } from 'lucide-react';

interface NodeToolbarProps {
  onAddNode: (type: string) => void;
}

export function NodeToolbar({ onAddNode }: NodeToolbarProps) {
  const nodeTypes = [
    { type: 'sftp_collector', icon: Database, label: 'SFTP Collector', color: 'hsl(217 91% 60%)' },
    { type: 'fdc', icon: CheckCircle, label: 'FDC', color: 'hsl(142 76% 36%)' },
    { type: 'asn1_decoder', icon: Activity, label: 'ASN.1 Decoder', color: 'hsl(271 91% 65%)' },
    { type: 'ascii_decoder', icon: FileText, label: 'ASCII Decoder', color: 'hsl(45 93% 47%)' },
    { type: 'validation_bln', icon: Filter, label: 'Validation BLN', color: 'hsl(0 84% 60%)' },
    { type: 'enrichment_bln', icon: AlertCircle, label: 'Enrichment BLN', color: 'hsl(25 95% 53%)' },
    { type: 'encoder', icon: RotateCcw, label: 'Encoder', color: 'hsl(173 80% 40%)' },
    { type: 'diameter_interface', icon: Globe, label: 'Diameter Interface', color: 'hsl(231 81% 63%)' },
    { type: 'raw_backup', icon: Database, label: 'Raw Backup', color: 'hsl(0 0% 45%)' },
  ];

  return (
    <div className="w-64 bg-card border-r border-border shadow-sm">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Nodes
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag and drop to add to canvas
        </p>
      </div>
      
      <div className="p-4 space-y-2">
        {nodeTypes.map((nodeType) => {
          const Icon = nodeType.icon;
          return (
            <Button
              key={nodeType.type}
              variant="outline"
              className="w-full justify-start gap-3 h-auto p-3 border-border/50 hover:border-border transition-all duration-200"
              onClick={() => onAddNode(nodeType.type)}
            >
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: nodeType.color }}
              />
              <Icon className="w-4 h-4" />
              <span>{nodeType.label}</span>
            </Button>
          );
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <div className="text-xs text-muted-foreground">
          <p className="mb-2">💡 Tips:</p>
          <ul className="space-y-1 text-xs">
            <li>• Connect nodes to create flows</li>
            <li>• Click nodes to edit properties</li>
            <li>• Use conditionals for branching</li>
          </ul>
        </div>
      </div>
    </div>
  );
}