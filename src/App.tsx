import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { MainLayout } from "@/components/layout/main-layout";
import { LoginPage } from "@/pages/LoginPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { StreamsPage } from "@/pages/StreamsPage";
import { AlertsPage } from "@/pages/AlertsPage";
import { ReportsPage } from "@/pages/ReportsPage";
import { FlowDetailPage } from "@/pages/flows/flow-detail/FlowDetailPage";
import { FlowEditorRoute } from '@/pages/flows/flow-editor/FlowEditorRoute';
import { CreateNodePage } from "@/pages/nodes/create-node/CreateNodePage";
import { NodeDetailPage } from "@/pages/nodes/node-detail/NodeDetailPage";
import { EditNodePage } from "@/pages/nodes/edit-node/EditNodePage";
import { TestNodePage } from "@/pages/nodes/test-node/TestNodePage";
import { SubnodeDetailPage } from "@/pages/subnodes/subnode-detail/SubnodeDetailPage";
import { EditSubnodePage } from "@/pages/subnodes/edit-subnode/EditSubnodePage";
import { EditVersionPage } from "@/pages/subnodes/edit-version/EditVersionPage";
import { EditVersionPage as EditNodeVersionPage } from "@/pages/nodes/edit-version/EditVersionPage";
import { CreateSubnodePage } from "@/pages/subnodes/create-subnode/CreateSubnodePage";
import { ParameterDetailPage } from "@/pages/parameters/parameter-detail/ParameterDetailPage";
import { CreateParameterPage } from "@/pages/parameters/create-parameter/CreateParameterPage";
import { EditParameterPage } from "@/pages/parameters/edit-parameter/EditParameterPage";
import { DevToolPage } from "@/pages/DevToolPage";
import { StreamDetailPage } from "@/pages/StreamDetailPage";
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
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Login route without layout */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* All other routes with main layout */}
          <Route path="/*" element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/streams" element={<StreamsPage />} />
                <Route path="/streams/:streamId" element={<StreamDetailPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/devtool" element={<DevToolPage />} />
                
                {/* Flow routes */}
                <Route path="/flows/:id" element={<FlowDetailPage />} />
                <Route path="/flows/:id/edit" element={<FlowEditorRoute />} />
                
                {/* Node routes */}
                <Route path="/nodes/new" element={<CreateNodePage />} />
                <Route path="/nodes/:id" element={<NodeDetailPage />} />
                <Route path="/nodes/:id/edit" element={<EditNodePage />} />
                <Route path="/nodes/:id/edit-version" element={<EditNodeVersionPage />} />
                <Route path="/nodes/:id/test" element={<TestNodePage />} />
                
                {/* Subnode routes */}
                <Route path="/subnodes/:id" element={<SubnodeDetailPage />} />
                <Route path="/subnodes/create" element={<CreateSubnodePage />} />
                <Route path="/subnodes/:id/edit" element={<EditSubnodePage />} />
                <Route path="/subnodes/:id/edit-version" element={<EditVersionPage />} />
                
                {/* Parameter routes */}
                <Route path="/parameters/new" element={<CreateParameterPage />} />
                <Route path="/parameters/:id" element={<ParameterDetailPage />} />
                <Route path="/parameters/:id/edit" element={<EditParameterPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
