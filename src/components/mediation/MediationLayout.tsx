import React from "react";
import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from "lucide-react";

interface MediationLayoutProps {
  title: string;
  description: string;
  totalFlows: number;
  runningFlows: number;
  stoppedFlows: number;
  errorFlows: number;
  totalRecords: number;
  avgErrorRate: number;
  children: ReactNode;
}

export function MediationLayout({
  title,
  description,
  totalFlows,
  runningFlows,
  stoppedFlows,
  errorFlows,
  totalRecords,
  avgErrorRate,
  children
}: MediationLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/3">
      <div className="space-y-8 p-8">
        {/* Header Section - Hidden when no title/description */}
        {(title || description) && (
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/8 via-primary/4 to-transparent" />
            <div className="relative bg-card/60 backdrop-blur-xl border border-border/40 p-10">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <div className="space-y-3">
                  {title && (
                    <h1 className="text-4xl font-bold text-gradient">
                      {title}
                    </h1>
                  )}
                  {description && (
                    <p className="text-lg text-muted-foreground max-w-2xl">
                      {description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enterprise Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/60 backdrop-blur-xl border-border/40 hover:bg-card/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary/10">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Flows</p>
                  <p className="text-3xl font-bold text-foreground">{totalFlows}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-border/40 hover:bg-card/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Running</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-success">{runningFlows}</p>
                    <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                      Active
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-border/40 hover:bg-card/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-warning/10">
                  <AlertTriangle className="h-6 w-6 text-warning" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Issues</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-warning">{errorFlows + stoppedFlows}</p>
                    <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                      Attention
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/60 backdrop-blur-xl border-border/40 hover:bg-card/70 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-info/10">
                  <TrendingUp className="h-6 w-6 text-info" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Records Processed</p>
                  <p className="text-3xl font-bold text-info">{totalRecords.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        {children}
      </div>
    </div>
  );
}