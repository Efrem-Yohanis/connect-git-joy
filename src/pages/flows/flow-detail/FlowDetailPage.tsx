import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlowCanvas } from "./FlowCanvas"; // Import FlowCanvas
import { Play, Square } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

export function FlowDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [flow, setFlow] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlowStructure = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/flows/${id}/structure/`);
        setFlow(response.data);
      } catch (err) {
        setError("Error fetching flow structure");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlowStructure();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!flow) {
    return <div>No flow found.</div>;
  }

  const getStatusBadge = () => {
    if (flow.is_running) {
      return <Badge className="bg-green-500 text-white">🟢 Running</Badge>;
    } else if (flow.is_deployed) {
      return <Badge className="bg-yellow-500 text-white">🟡 Deployed</Badge>;
    } else {
      return <Badge className="bg-red-500 text-white">🔴 Not Deployed</Badge>;
    }
  };

  // Helper function to determine node type based on name or other criteria
  const getNodeType = (nodeName: string): string => {
    const name = nodeName.toLowerCase();
    if (name.includes('sftp') || name.includes('collector')) return 'sftp_collector';
    if (name.includes('fdc')) return 'fdc';
    if (name.includes('asn1') || name.includes('decoder')) return 'asn1_decoder';
    if (name.includes('ascii')) return 'ascii_decoder';
    if (name.includes('validation')) return 'validation_bln';
    if (name.includes('enrichment')) return 'enrichment_bln';
    if (name.includes('encoder')) return 'encoder';
    if (name.includes('diameter')) return 'diameter_interface';
    if (name.includes('backup')) return 'raw_backup';
    return 'generic';
  };

  // Create unique nodes map to avoid duplicates
  const uniqueNodes = new Map();
  flow.flow_nodes.forEach((flowNode) => {
    if (!uniqueNodes.has(flowNode.node.id)) {
      uniqueNodes.set(flowNode.node.id, flowNode);
    }
  });

  // Prepare nodes from the unique nodes with proper positioning
  const nodes = Array.from(uniqueNodes.values()).map((flowNode, index) => {
    const nodeType = getNodeType(flowNode.node.name);
    
    return {
      id: flowNode.node.id,
      type: nodeType,
      position: { 
        x: (index % 4) * 300 + 100, // Arrange in a grid pattern
        y: Math.floor(index / 4) * 200 + 100 
      },
      data: {
        label: flowNode.node.name,
        description: `Version: ${flowNode.node.version}`,
        node: flowNode.node,
        selected_subnode: flowNode.selected_subnode,
        parameters: flowNode.selected_subnode?.parameter_values || [],
        subnodes: flowNode.node.subnodes || [],
      },
    };
  });

  // Prepare edges from all outgoing edges, removing duplicates
  const uniqueEdges = new Map();
  flow.flow_nodes.forEach((flowNode) => {
    flowNode.outgoing_edges?.forEach((edge) => {
      if (!uniqueEdges.has(edge.id)) {
        uniqueEdges.set(edge.id, {
          id: edge.id,
          source: edge.from_node,
          target: edge.to_node,
          animated: true,
          label: edge.condition || undefined,
        });
      }
    });
  });
  
  const edges = Array.from(uniqueEdges.values());

  const handleRunFlow = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/flows/${id}/start/`);
      setFlow(prev => ({ ...prev, is_running: true }));
      toast({
        title: "Flow Started",
        description: "The flow has been started successfully.",
      });
    } catch (err: any) {
      console.error("Error starting flow:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error starting flow";
      toast({
        title: "Error Starting Flow",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleStopFlow = async () => {
    try {
      await axios.post(`http://127.0.0.1:8000/api/flows/${id}/stop/`);
      setFlow(prev => ({ ...prev, is_running: false }));
      toast({
        title: "Flow Stopped",
        description: "The flow has been stopped successfully.",
      });
    } catch (err: any) {
      console.error("Error stopping flow:", err);
      const errorMessage = err.response?.data?.error || err.message || "Error stopping flow";
      toast({
        title: "Error Stopping Flow",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">{flow.name}</h1>
          {getStatusBadge()}
        </div>
        <div className="flex items-center space-x-2">
          {flow.is_deployed && !flow.is_running && (
            <Button onClick={handleRunFlow}>
              <Play className="h-4 w-4 mr-2" />
              Run
            </Button>
          )}
          {flow.is_running && (
            <Button variant="destructive" onClick={handleStopFlow}>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </Button>
          )}
          <Button onClick={() => navigate(`/flows/${id}/edit`)}>Edit Flow</Button>
        </div>
      </div>

      {/* Flow Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <h3 className="font-semibold">Description</h3>
          <p>{flow.description}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Created At</h3>
          <p>{new Date(flow.created_at).toLocaleString()}</p>
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold">Created By</h3>
          <p>{flow.created_by}</p>
        </div>
      </div>

      {/* Flow Canvas */}
      <div className="h-[600px] border border-border rounded-lg">
        <FlowCanvas nodes={nodes} edges={edges} onNodeSelect={(node) => console.log(node)} />
      </div>
    </div>
  );
}