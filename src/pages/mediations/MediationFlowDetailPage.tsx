import { useParams } from "react-router-dom";
import { StreamHeader } from "./components/StreamHeader";
import { GeneralInfoPanel } from "./components/GeneralInfoPanel";
import { FlowNodesView } from "./components/FlowNodesView";
import { AlertsLogsPanel } from "./components/AlertsLogsPanel";
import { PerformanceStats } from "./components/PerformanceStats";
import { ExecutionSettings } from "./components/ExecutionSettings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FlowDetail {
  id: string;
  name: string;
  type: string;
  status: "running" | "stopped" | "error" | "partial";
  description: string;
  lastRun: string;
  processedRecords: number;
  errorRate: number;
  uptime: string;
  lastStartTimestamp: string;
  hosts: string[];
  currentRevision: string;
  baseRevision: string;
}

const mockFlowData: Record<string, FlowDetail> = {
  "1": {
    id: "1",
    name: "EBU_Bulk_SMS_LMS_TO_DWH_Non_Processing_Stream",
    type: "charging",
    status: "running",
    description: "Processes charging events from the billing system with real-time validation and enrichment",
    lastRun: "2024-01-15 14:30:00",
    processedRecords: 15420,
    errorRate: 0.02,
    uptime: "72h 14m 30s",
    lastStartTimestamp: "2024-01-12 23:15:30",
    hosts: ["mediation-01.domain.com", "mediation-02.domain.com", "mediation-03.domain.com"],
    currentRevision: "v2.1.4-build.1245",
    baseRevision: "v2.1.3-stable"
  },
  "2": {
    id: "2", 
    name: "Charging_Backup_Processing_Stream",
    type: "charging",
    status: "stopped",
    description: "Handles backup charging event processing with enhanced error recovery",
    lastRun: "2024-01-15 12:15:00",
    processedRecords: 8930,
    errorRate: 0.01,
    uptime: "0h 0m 0s",
    lastStartTimestamp: "2024-01-15 12:15:00",
    hosts: ["mediation-backup-01.domain.com"],
    currentRevision: "v2.1.4-build.1245",
    baseRevision: "v2.1.3-stable"
  },
  "3": {
    id: "3",
    name: "Convergent_Main_Billing_Stream", 
    type: "convergent",
    status: "partial",
    description: "Main convergent billing mediation stream with multi-service support",
    lastRun: "2024-01-15 14:35:00",
    processedRecords: 23450,
    errorRate: 0.03,
    uptime: "168h 45m 12s",
    lastStartTimestamp: "2024-01-08 21:49:48",
    hosts: ["convergent-01.domain.com", "convergent-02.domain.com"],
    currentRevision: "v3.2.1-build.2156",
    baseRevision: "v3.2.0-stable"
  },
  "4": {
    id: "4",
    name: "Convergent_Secondary_Stream",
    type: "convergent", 
    status: "error",
    description: "Secondary convergent processing stream for overflow handling",
    lastRun: "2024-01-15 13:20:00",
    processedRecords: 12340,
    errorRate: 0.15,
    uptime: "0h 0m 0s",
    lastStartTimestamp: "2024-01-15 13:20:00",
    hosts: ["convergent-secondary-01.domain.com"],
    currentRevision: "v3.2.1-build.2156",
    baseRevision: "v3.2.0-stable"
  },
  "5": {
    id: "5",
    name: "NCC_Primary_Control_Stream",
    type: "ncc",
    status: "running", 
    description: "Network call control mediation processing with real-time monitoring",
    lastRun: "2024-01-15 14:40:00",
    processedRecords: 9876,
    errorRate: 0.001,
    uptime: "240h 25m 30s",
    lastStartTimestamp: "2024-01-05 14:14:30",
    hosts: ["ncc-primary-01.domain.com", "ncc-primary-02.domain.com"],
    currentRevision: "v1.8.2-build.892",
    baseRevision: "v1.8.1-stable"
  },
  "6": {
    id: "6",
    name: "NCC_Backup_Control_Stream",
    type: "ncc",
    status: "stopped",
    description: "Backup NCC mediation stream for failover scenarios",
    lastRun: "2024-01-15 11:45:00", 
    processedRecords: 5432,
    errorRate: 0.005,
    uptime: "0h 0m 0s",
    lastStartTimestamp: "2024-01-15 11:45:00",
    hosts: ["ncc-backup-01.domain.com"],
    currentRevision: "v1.8.2-build.892",
    baseRevision: "v1.8.1-stable"
  }
};

export function MediationFlowDetailPage() {
  const { flowId } = useParams<{ flowId: string }>();
  
  const flow = flowId ? mockFlowData[flowId] : null;

  if (!flow) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-muted-foreground">Flow Not Found</h2>
          <p className="text-muted-foreground mt-2">The requested mediation flow does not exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stream Header */}
      <StreamHeader
        streamName={flow.name}
        status={flow.status}
        lastRun={flow.lastRun}
        mediationType={flow.type}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* General Info Panel */}
          <GeneralInfoPanel
            uptime={flow.uptime}
            lastStartTimestamp={flow.lastStartTimestamp}
            status={flow.status}
            hosts={flow.hosts}
            currentRevision={flow.currentRevision}
            baseRevision={flow.baseRevision}
            description={flow.description}
          />
          
          {/* Performance Stats */}
          <PerformanceStats
            throughputLastHour={520}
            eventsLastHour={flow.processedRecords}
            eventsLast24h={348960}
            eventsLast7d={2443200}
            errorRate={flow.errorRate}
            retryCount={15}
          />
        </TabsContent>
        
        <TabsContent value="pipeline" className="space-y-6 mt-6">
          {/* Flow/Nodes View */}
          <FlowNodesView nodes={[]} />
        </TabsContent>
        
        <TabsContent value="monitoring" className="space-y-6 mt-6">
          {/* Alerts & Logs */}
          <AlertsLogsPanel />
        </TabsContent>
        
        <TabsContent value="settings" className="space-y-6 mt-6">
          {/* Execution Settings */}
          <ExecutionSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}