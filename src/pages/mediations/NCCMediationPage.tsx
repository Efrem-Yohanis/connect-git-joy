import { MediationLayout } from "@/components/mediation/MediationLayout";
import { MediationContent, MediationFlow } from "@/components/mediation/MediationContent";

const nccFlows: MediationFlow[] = [
  {
    id: "5",
    name: "NCC Stream A",
    status: "running", 
    description: "Network call control mediation processing",
    lastRun: "2024-01-15 14:40:00",
    processedRecords: 9876,
    errorRate: 0.001
  },
  {
    id: "6",
    name: "NCC Stream B",
    status: "stopped",
    description: "Backup NCC mediation stream",
    lastRun: "2024-01-15 11:45:00", 
    processedRecords: 5432,
    errorRate: 0.005
  }
];

export function NCCMediationPage() {
  const runningFlows = nccFlows.filter(flow => flow.status === "running").length;
  const stoppedFlows = nccFlows.filter(flow => flow.status === "stopped").length;
  const errorFlows = nccFlows.filter(flow => flow.status === "error").length;
  const totalRecords = nccFlows.reduce((sum, flow) => sum + flow.processedRecords, 0);
  const avgErrorRate = nccFlows.reduce((sum, flow) => sum + flow.errorRate, 0) / nccFlows.length;

  return (
    <MediationLayout
      title="Network Call Control"
      description=""
      totalFlows={nccFlows.length}
      runningFlows={runningFlows}
      stoppedFlows={stoppedFlows}
      errorFlows={errorFlows}
      totalRecords={totalRecords}
      avgErrorRate={avgErrorRate}
    >
      <MediationContent flows={nccFlows} basePath="/mediations/ncc" />
    </MediationLayout>
  );
}