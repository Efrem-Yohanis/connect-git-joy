import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";

import { MainLayout } from "@/components/layout/main-layout";
import { HomePage } from "@/pages/HomePage";
import { FlowsPage } from "@/pages/flows/FlowsPage";
import { FlowDetailPage } from "@/pages/flows/flow-detail/FlowDetailPage";
import { FlowEditor } from "@/pages/flows/flow-editor/FlowEditor";
import { NodesPage } from "@/pages/nodes/NodesPage";
import { NodeDetailPage } from "@/pages/nodes/node-detail/NodeDetailPage";
import { CreateNodePage } from "@/pages/nodes/create-node/CreateNodePage";
import { EditNodePage } from "@/pages/nodes/edit-node/EditNodePage";
import { SubnodesPage } from "@/pages/subnodes/SubnodesPage";
import { SubnodeDetailPage } from "@/pages/subnodes/subnode-detail/SubnodeDetailPage";
import { EditSubnodePage } from "@/pages/subnodes/edit-subnode/EditSubnodePage";
import { CreateSubnodePage } from "@/pages/subnodes/create-subnode/CreateSubnodePage";
import { ParametersPage } from "@/pages/parameters/ParametersPage";
import { ParameterDetailPage } from "@/pages/parameters/parameter-detail/ParameterDetailPage";
import { CreateParameterPage } from "@/pages/parameters/create-parameter/CreateParameterPage";
import { EditParameterPage } from "@/pages/parameters/edit-parameter/EditParameterPage";
import { EdgesPage } from "@/pages/edges/EdgesPage";
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
              <Route path="/" element={<HomePage />} />
              <Route path="/flows" element={<FlowsPage />} />
              <Route path="/flows/:id" element={<FlowDetailPage />} />
              <Route path="/flows/:id/edit" element={<FlowEditor />} />
              <Route path="/nodes" element={<NodesPage />} />
              <Route path="/nodes/new" element={<CreateNodePage />} />
              <Route path="/nodes/:id" element={<NodeDetailPage />} />
              <Route path="/nodes/:id/edit" element={<EditNodePage />} />
              <Route path="/subnodes" element={<SubnodesPage />} />
              <Route path="/subnodes/:id" element={<SubnodeDetailPage />} />
            <Route path="/subnodes/create" element={<CreateSubnodePage />} />
            <Route path="/subnodes/:id/edit" element={<EditSubnodePage />} />
              <Route path="/parameters" element={<ParametersPage />} />
              <Route path="/parameters/new" element={<CreateParameterPage />} />
              <Route path="/parameters/:id" element={<ParameterDetailPage />} />
              <Route path="/parameters/:id/edit" element={<EditParameterPage />} />
              <Route path="/edges" element={<EdgesPage />} />
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
