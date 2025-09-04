import { MediationLayout } from "@/components/mediation/MediationLayout";
import { MediationContent, MediationFlow } from "@/components/mediation/MediationContent";

const chargingFlows: MediationFlow[] = [
  {
    id: "1",
    name: "Charging Stream A",
    status: "running",
    description: "Processes charging events from the billing system",
    lastRun: "2024-01-15 14:30:00",
    processedRecords: 15420,
    errorRate: 0.02
  },
  {
    id: "2", 
    name: "Charging Stream B",
    status: "stopped",
    description: "Handles backup charging event processing",
    lastRun: "2024-01-15 12:15:00",
    processedRecords: 8930,
    errorRate: 0.01
  }
];

export function ChargingMediationPage() {
  const runningFlows = chargingFlows.filter(flow => flow.status === "running").length;
  const stoppedFlows = chargingFlows.filter(flow => flow.status === "stopped").length;
  const errorFlows = chargingFlows.filter(flow => flow.status === "error").length;
  const totalRecords = chargingFlows.reduce((sum, flow) => sum + flow.processedRecords, 0);
  const avgErrorRate = chargingFlows.reduce((sum, flow) => sum + flow.errorRate, 0) / chargingFlows.length;

  return (
    <MediationLayout
      title="Charging Gateway"
      description=""
      totalFlows={chargingFlows.length}
      runningFlows={runningFlows}
      stoppedFlows={stoppedFlows}
      errorFlows={errorFlows}
      totalRecords={totalRecords}
      avgErrorRate={avgErrorRate}
    >
      <MediationContent flows={chargingFlows} basePath="/mediations/charging" />
    </MediationLayout>
  );
}