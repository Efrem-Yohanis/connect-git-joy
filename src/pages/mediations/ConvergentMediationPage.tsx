import { MediationLayout } from "@/components/mediation/MediationLayout";
import { MediationContent, MediationFlow } from "@/components/mediation/MediationContent";

const convergentFlows: MediationFlow[] = [
  {
    id: "3",
    name: "Convergent Stream A", 
    status: "running",
    description: "Main convergent billing mediation stream",
    lastRun: "2024-01-15 14:35:00",
    processedRecords: 23450,
    errorRate: 0.03
  },
  {
    id: "4",
    name: "Convergent Stream B",
    status: "error",
    description: "Secondary convergent processing stream",
    lastRun: "2024-01-15 13:20:00",
    processedRecords: 12340,
    errorRate: 0.15
  }
];

export function ConvergentMediationPage() {
  const runningFlows = convergentFlows.filter(flow => flow.status === "running").length;
  const stoppedFlows = convergentFlows.filter(flow => flow.status === "stopped").length;
  const errorFlows = convergentFlows.filter(flow => flow.status === "error").length;
  const totalRecords = convergentFlows.reduce((sum, flow) => sum + flow.processedRecords, 0);
  const avgErrorRate = convergentFlows.reduce((sum, flow) => sum + flow.errorRate, 0) / convergentFlows.length;

  return (
    <MediationLayout
      title="Convergent Billing Excellence"
      description="Unified convergent billing mediation ecosystem with advanced stream processing, intelligent data transformation, and enterprise-grade operational monitoring for telecommunications service providers."
      totalFlows={convergentFlows.length}
      runningFlows={runningFlows}
      stoppedFlows={stoppedFlows}
      errorFlows={errorFlows}
      totalRecords={totalRecords}
      avgErrorRate={avgErrorRate}
    >
      <MediationContent flows={convergentFlows} basePath="/mediations/convergent" />
    </MediationLayout>
  );
}