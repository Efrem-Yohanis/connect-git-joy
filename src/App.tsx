import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { MainLayout } from "@/components/layout/main-layout";
import { DashboardPage } from "@/pages/DashboardPage";
import { HomePage } from "@/pages/HomePage";
import { FlowsPage } from "@/pages/flows/FlowsPage";
import { FlowDetailPage } from "@/pages/flows/flow-detail/FlowDetailPage";
import { FlowEditorRoute } from '@/pages/flows/flow-editor/FlowEditorRoute';
import { NodesPage } from "@/pages/nodes/NodesPage";
import { NodeDetailPage } from "@/pages/nodes/node-detail/NodeDetailPage";
import { CreateNodePage } from "@/pages/nodes/create-node/CreateNodePage";
import { EditNodePage } from "@/pages/nodes/edit-node/EditNodePage";
import { TestNodePage } from "@/pages/nodes/test-node/TestNodePage";
import { SubnodesPage } from "@/pages/subnodes/SubnodesPage";
import { SubnodeDetailPage } from "@/pages/subnodes/subnode-detail/SubnodeDetailPage";
import { EditSubnodePage } from "@/pages/subnodes/edit-subnode/EditSubnodePage";
import { EditVersionPage } from "@/pages/subnodes/edit-version/EditVersionPage";
import { EditVersionPage as EditNodeVersionPage } from "@/pages/nodes/edit-version/EditVersionPage";
import { CreateSubnodePage } from "@/pages/subnodes/create-subnode/CreateSubnodePage";
import { ParametersPage } from "@/pages/parameters/ParametersPage";
import { ParameterDetailPage } from "@/pages/parameters/parameter-detail/ParameterDetailPage";
import { CreateParameterPage } from "@/pages/parameters/create-parameter/CreateParameterPage";
import { EditParameterPage } from "@/pages/parameters/edit-parameter/EditParameterPage";
import { EdgesPage } from "@/pages/edges/EdgesPage";
import { FlowReportPage } from "@/pages/reports/FlowReportPage";
import { NodeReportPage } from "@/pages/reports/NodeReportPage";
import { FlowAlertPage } from "@/pages/alerts/FlowAlertPage";
import { NodeAlertPage } from "@/pages/alerts/NodeAlertPage";
import { DevToolPage } from "@/pages/DevToolPage";
import { MediationFlowDetailPage } from "@/pages/mediations/MediationFlowDetailPage";
import { ChargingMediationPage } from "@/pages/mediations/ChargingMediationPage";
import { ConvergentMediationPage } from "@/pages/mediations/ConvergentMediationPage";
import { NCCMediationPage } from "@/pages/mediations/NCCMediationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <MainLayout>
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/flows" element={<FlowsPage />} />
              <Route path="/flows/:id" element={<FlowDetailPage />} />
              <Route path="/flows/:id/edit" element={<FlowEditorRoute />} />
              <Route path="/nodes" element={<NodesPage />} />
              <Route path="/nodes/new" element={<CreateNodePage />} />
              <Route path="/nodes/:id" element={<NodeDetailPage />} />
              <Route path="/nodes/:id/edit" element={<EditNodePage />} />
              <Route path="/nodes/:id/edit-version" element={<EditNodeVersionPage />} />
              <Route path="/nodes/:id/test" element={<TestNodePage />} />
              <Route path="/subnodes" element={<SubnodesPage />} />
              <Route path="/subnodes/:id" element={<SubnodeDetailPage />} />
            <Route path="/subnodes/create" element={<CreateSubnodePage />} />
            <Route path="/subnodes/:id/edit" element={<EditSubnodePage />} />
            <Route path="/subnodes/:id/edit-version" element={<EditVersionPage />} />
              <Route path="/parameters" element={<ParametersPage />} />
              <Route path="/parameters/new" element={<CreateParameterPage />} />
              <Route path="/parameters/:id" element={<ParameterDetailPage />} />
              <Route path="/parameters/:id/edit" element={<EditParameterPage />} />
              <Route path="/edges" element={<EdgesPage />} />
              <Route path="/reports/flows" element={<FlowReportPage />} />
              <Route path="/reports/nodes" element={<NodeReportPage />} />
              <Route path="/alerts/flows" element={<FlowAlertPage />} />
              <Route path="/alerts/nodes" element={<NodeAlertPage />} />
              <Route path="/devtool" element={<DevToolPage />} />
          <Route path="/mediations/charging" element={<ChargingMediationPage />} />
          <Route path="/mediations/convergent" element={<ConvergentMediationPage />} />
          <Route path="/mediations/ncc" element={<NCCMediationPage />} />
          <Route path="/mediations/charging/flow/:flowId" element={<MediationFlowDetailPage />} />
          <Route path="/mediations/convergent/flow/:flowId" element={<MediationFlowDetailPage />} />
          <Route path="/mediations/ncc/flow/:flowId" element={<MediationFlowDetailPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </MainLayout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
