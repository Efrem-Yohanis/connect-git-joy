import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Play, 
  Square, 
  RotateCcw, 
  EyeOff, 
  FileText,
  Activity,
  Clock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface StreamHeaderProps {
  streamName: string;
  status: "running" | "stopped" | "error" | "partial";
  lastRun: string;
  mediationType: string;
}

export function StreamHeader({ streamName, status, lastRun, mediationType }: StreamHeaderProps) {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-success/10 text-success border-success/20";
      case "stopped": return "bg-muted text-muted-foreground border-border";
      case "error": return "bg-destructive/10 text-destructive border-destructive/20";
      case "partial": return "bg-warning/10 text-warning border-warning/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return <Activity className="h-4 w-4" />;
      case "stopped": return <Square className="h-4 w-4" />;
      case "error": return <Activity className="h-4 w-4" />;
      case "partial": return <Activity className="h-4 w-4" />;
      default: return <Square className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate('/dashboard')}
              className="cursor-pointer hover:text-primary"
            >
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink 
              onClick={() => navigate(`/mediations/${mediationType}`)}
              className="cursor-pointer hover:text-primary"
            >
              Streams
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbPage>{streamName}</BreadcrumbPage>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold text-foreground">{streamName}</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge className={getStatusColor(status)}>
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status}</span>
            </Badge>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last run: {lastRun}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2">
          {status === "stopped" && (
            <Button size="sm" className="bg-success hover:bg-success/90">
              <Play className="h-4 w-4 mr-2" />
              Start
            </Button>
          )}
          {(status === "running" || status === "partial") && (
            <Button variant="outline" size="sm">
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          <Button variant="outline" size="sm">
            <RotateCcw className="h-4 w-4 mr-2" />
            Restart
          </Button>
          <Button variant="outline" size="sm">
            <EyeOff className="h-4 w-4 mr-2" />
            Hide
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Add Note
          </Button>
        </div>
      </div>
    </div>
  );
}