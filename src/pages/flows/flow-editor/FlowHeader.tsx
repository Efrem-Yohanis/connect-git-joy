import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Square, 
  Upload, 
  Download, 
  Save, 
  Settings, 
  MoreHorizontal,
  Zap 
} from 'lucide-react';

interface FlowHeaderProps {
  flowName: string;
  onAction: (action: string) => void;
}

export function FlowHeader({ flowName, onAction }: FlowHeaderProps) {
  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Left: Flow info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">{flowName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  Draft
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Last saved: 2 minutes ago
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => onAction('save')}
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Status bar */}
      <div className="bg-muted/30 border-t border-border px-6 py-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>5 nodes • 4 connections</span>
            <span>•</span>
            <span>Ready to deploy</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span>Zoom: 100%</span>
            <span>•</span>
            <span>Auto-save: On</span>
          </div>
        </div>
      </div>
    </header>
  );
}