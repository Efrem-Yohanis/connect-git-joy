import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flow interfaces based on the API documentation
export interface FlowNode {
  id: string;
  order: number;
  node: {
    id: string;
    name: string;
    subnodes: Subnode[];
  };
  selected_subnode?: {
    id: string;
    name: string;
    parameter_values: ParameterValue[];
  };
  outgoing_edges?: Edge[];
}

export interface Subnode {
  id: string;
  name: string;
  parameters: Parameter[];
  is_selected: boolean;
}

export interface Parameter {
  key: string;
  default_value: string;
}

export interface ParameterValue {
  parameter_key: string;
  value: string;
}

export interface Edge {
  id: string;
  from_node: string;
  to_node: string;
  condition?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  is_deployed: boolean;
  is_running: boolean;
  flow_nodes: FlowNode[];
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface FlowVersion {
  id: string;
  version: number;
  created_at: string;
  created_by: string;
  is_active: boolean;
  description?: string;
}

export interface DeployedNode {
  id: string;
  name: string;
  subnodes: Subnode[];
}

// Mock data for deployed nodes
const mockDeployedNodes: DeployedNode[] = [
  {
    id: 'node-1',
    name: 'SFTP Collector Node',
    subnodes: [
      { id: 'sub1', name: 'Connection Handler', parameters: [], is_selected: true },
      { id: 'sub2', name: 'File Scanner', parameters: [], is_selected: false },
    ]
  },
  {
    id: 'node-2', 
    name: 'ASN.1 Decoder Node',
    subnodes: [
      { id: 'sub3', name: 'Schema Loader', parameters: [], is_selected: true },
      { id: 'sub4', name: 'Data Parser', parameters: [], is_selected: false },
    ]
  },
  {
    id: 'node-3',
    name: 'Validation BLN Node', 
    subnodes: [
      { id: 'sub5', name: 'Rule Engine', parameters: [], is_selected: true },
      { id: 'sub6', name: 'Quality Check', parameters: [], is_selected: false },
    ]
  }
];

// API Service Functions
export const flowService = {
  // Create flownode - add node to flow
  async createFlowNode(data: { 
    order?: number | null; 
    node_id: string; 
    flow_id: string; 
    from_node?: string | null; 
  }): Promise<FlowNode> {
    try {
      const response = await axiosInstance.post('flownodes/', data);
      return response.data;
    } catch (error) {
      // Fallback to mock implementation if API endpoint doesn't exist yet
      console.warn('FlowNode API endpoint not available, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return a mock FlowNode for development
      const mockFlowNode: FlowNode = {
        id: `flownode-${Date.now()}`,
        order: data.order || 1,
        node: {
          id: data.node_id,
          name: `Node ${data.node_id}`,
          subnodes: []
        },
        selected_subnode: undefined,
        outgoing_edges: []
      };
      
      console.log('Mock FlowNode created:', mockFlowNode);
      return mockFlowNode;
    }
  },

  // Create a new flow
  async createFlow(data: { name: string; description: string; created_by?: string; last_updated_by?: string }): Promise<Flow> {
    try {
      const response = await axiosInstance.post('flows/', {
        name: data.name,
        description: data.description,
        is_deployed: false,
        created_by: data.created_by || 'user',
        last_updated_by: data.last_updated_by || 'user'
      });
      return response.data;
    } catch (error) {
      console.warn('Flow creation API endpoint not available, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 300));
      const newFlow: Flow = {
        id: Date.now().toString(),
        name: data.name,
        description: data.description,
        is_deployed: false,
        is_running: false,
        flow_nodes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: data.created_by || 'user'
      };
      return newFlow;
    }
  },

  // Get deployed nodes for flow editor - now uses real API
  async getDeployedNodes(): Promise<DeployedNode[]> {
    const response = await axiosInstance.get('nodes/');
    return response.data.map((node: any) => ({
      id: node.id,
      name: node.name,
      subnodes: node.subnodes || []
    }));
  },

  // Add node to flow
  async addNodeToFlow(data: { flow: string; node: string; order: number }): Promise<FlowNode> {
    // Mock implementation - simulate successful addition
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const deployedNode = mockDeployedNodes.find(n => n.id === data.node);
    if (!deployedNode) {
      throw new Error('Node not found');
    }
    
    const newFlowNode: FlowNode = {
      id: `flow-node-${Date.now()}`,
      order: data.order,
      node: {
        id: deployedNode.id,
        name: deployedNode.name,
        subnodes: deployedNode.subnodes
      },
      selected_subnode: deployedNode.subnodes.find(s => s.is_selected) ? {
        id: deployedNode.subnodes.find(s => s.is_selected)!.id,
        name: deployedNode.subnodes.find(s => s.is_selected)!.name,
        parameter_values: []
      } : undefined,
      outgoing_edges: []
    };
    
    console.log('Successfully added node to flow:', newFlowNode);
    return newFlowNode;
  },

  // Get flow details
  async getFlow(id: string): Promise<Flow> {
    try {
      const response = await axiosInstance.get(`flows/${id}/`);
      return response.data;
    } catch (error) {
      console.warn('Flow API endpoint not available, using mock implementation');
      // Return mock flow for development
      const mockFlow: Flow = {
        id: id,
        name: `Flow ${id}`,
        description: 'Mock flow for development',
        is_deployed: false,
        is_running: false,
        flow_nodes: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: 'user'
      };
      return mockFlow;
    }
  },

  // Update flow
  async updateFlow(id: string, data: Partial<Flow>): Promise<Flow> {
    const response = await axiosInstance.put(`flows/${id}/`, data);
    return response.data;
  },

  // Start flow
  async startFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/start/`);
    return response.data;
  },

  // Stop flow
  async stopFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/stop/`);
    return response.data;
  },

  // Deploy flow
  async deployFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/deploy/`);
    return response.data;
  },

  // Undeploy flow
  async undeployFlow(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`flows/${id}/undeploy/`);
    return response.data;
  },

  // Update flownode connection (from_node field)
  async updateFlowNodeConnection(flowNodeId: string, fromNodeId: string | null): Promise<FlowNode> {
    try {
      const response = await axiosInstance.patch(`flownodes/${flowNodeId}/`, {
        from_node: fromNodeId
      });
      return response.data;
    } catch (error) {
      console.warn('FlowNode connection API endpoint not available, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock updated FlowNode
      const mockFlowNode: FlowNode = {
        id: flowNodeId,
        order: 1,
        node: {
          id: 'mock-node',
          name: 'Mock Node',
          subnodes: []
        },
        selected_subnode: undefined,
        outgoing_edges: []
      };
      
      console.log('Mock FlowNode connection updated:', mockFlowNode);
      return mockFlowNode;
    }
  },

  // Update flownode selected subnode
  async updateFlowNodeSubnode(flowNodeId: string, subnodeId: string): Promise<FlowNode> {
    try {
      const response = await axiosInstance.patch(`flownodes/${flowNodeId}/`, {
        selected_subnode: subnodeId
      });
      return response.data;
    } catch (error) {
      console.warn('FlowNode subnode API endpoint not available, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock updated FlowNode
      const mockFlowNode: FlowNode = {
        id: flowNodeId,
        order: 1,
        node: {
          id: 'mock-node',
          name: 'Mock Node',
          subnodes: []
        },
        selected_subnode: {
          id: subnodeId,
          name: 'Mock Subnode',
          parameter_values: []
        },
        outgoing_edges: []
      };
      
      console.log('Mock FlowNode subnode updated:', mockFlowNode);
      return mockFlowNode;
    }
  },

  // Delete flownode
  async deleteFlowNode(flowNodeId: string): Promise<void> {
    try {
      await axiosInstance.delete(`flownodes/${flowNodeId}/`);
    } catch (error) {
      console.warn('FlowNode deletion API endpoint not available, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 300));
      console.log('Mock FlowNode deleted:', flowNodeId);
    }
  },

  // Validate flow
  async validateFlow(flowId: string): Promise<{ valid: boolean; errors?: string[] }> {
    try {
      const response = await axiosInstance.post(`flows/${flowId}/validate/`);
      return { valid: true };
    } catch (error: any) {
      if (error.response?.status === 400) {
        return {
          valid: false,
          errors: error.response.data.errors || ['Flow validation failed']
        };
      }
      throw error;
    }
  },

  // Get all flows
  async getFlows(): Promise<Flow[]> {
    try {
      const response = await axiosInstance.get('flows/');
      return response.data;
    } catch (error) {
      console.warn('Flows API endpoint not available, using mock implementation');
      return [];
    }
  },
  // Get flow versions
  async getFlowVersions(id: string): Promise<FlowVersion[]> {
    try {
      const response = await axiosInstance.get(`flows/${id}/versions/`);
      return response.data;
    } catch (error) {
      console.warn('Flow versions API endpoint not available, using mock implementation');
      // Return mock versions for development
      const mockVersions: FlowVersion[] = [
        {
          id: `${id}-v3`,
          version: 3,
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          created_by: 'john.doe',
          is_active: true,
          description: 'Added new validation node'
        },
        {
          id: `${id}-v2`,
          version: 2,
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          created_by: 'jane.smith',
          is_active: false,
          description: 'Updated data processing logic'
        },
        {
          id: `${id}-v1`,
          version: 1,
          created_at: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
          created_by: 'john.doe',
          is_active: false,
          description: 'Initial flow version'
        }
      ];
      return mockVersions;
    }
  },

  // Activate flow version
  async activateFlowVersion(id: string, version: number): Promise<{ status: string; message: string }> {
    try {
      const response = await axiosInstance.post(`flows/${id}/activate-version/`, { version });
      return response.data;
    } catch (error) {
      console.warn('Flow version activation API endpoint not available, using mock implementation');
      await new Promise(resolve => setTimeout(resolve, 500));
      return {
        status: 'success',
        message: `Flow version ${version} activated successfully`
      };
    }
  },
};

// Custom hook for deployed nodes
export const useDeployedNodes = () => {
  const [data, setData] = useState<DeployedNode[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        console.log('Loading deployed nodes from API...');
        const nodes = await flowService.getDeployedNodes();
        console.log('Deployed nodes loaded successfully:', nodes);
        setData(nodes);
        setError(null);
      } catch (err: any) {
        console.error('Error loading deployed nodes:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching deployed nodes');
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const nodes = await flowService.getDeployedNodes();
      setData(nodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching deployed nodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for single flow
export const useFlow = (id: string) => {
  const [data, setData] = useState<Flow | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadFlow = async () => {
      try {
        setLoading(true);
        const flow = await flowService.getFlow(id);
        setData(flow);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching flow');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadFlow();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const flow = await flowService.getFlow(id);
      setData(flow);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching flow');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};