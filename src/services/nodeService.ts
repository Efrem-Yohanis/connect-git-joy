
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces based on API response
export interface NodeParameter {
  id: string;
  key: string;
  default_value: string;
  datatype: string;
  is_active: boolean;
}

export interface SubnodeParameterValue {
  id: string;
  parameter_key: string;
  value: string;
}

export interface SubnodeVersion {
  id: string;
  version: number;
  is_deployed: boolean;
  is_editable: boolean;
  updated_at: string;
  updated_by: string;
  version_comment: string | null;
  parameter_values: SubnodeParameterValue[];
}

export interface Subnode {
  id: string;
  name: string;
  description: string;
  node: string;
  active_version: number | null;
  original_version: number;
  version_comment: string | null;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  versions: SubnodeVersion[];
  version: number;
  is_selected: boolean;
  last_updated_at: string;
}

export interface NodeVersion {
  id: string;
  version: number;
  is_deployed: boolean;
  is_editable: boolean;
  script: string;
  updated_at: string;
  version_comment: string | null;
  parameters: NodeParameter[];
  subnodes: Subnode[];
}

export interface Node {
  id: string;
  name: string;
  description: string;
  script: string;
  version: number;
  version_comment: string | null;
  versions: NodeVersion[];
  total_versions: number;
  active_version: number | null;
  original_version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
}

// API Service Functions
export const nodeService = {
  // List all nodes
  async getAllNodes(): Promise<Node[]> {
    console.log('📡 Fetching all nodes...');
    try {
      const response = await axiosInstance.get('node-families/');
      console.log('✅ Nodes fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching nodes:', error);
      throw error;
    }
  },

  // Get single node detail
  async getNode(id: string): Promise<Node> {
    console.log(`📡 Fetching node ${id}...`);
    try {
      const response = await axiosInstance.get(`node-families/${id}/`);
      console.log('✅ Node fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching node ${id}:`, error);
      throw error;
    }
  },

  // Update node
  async updateNode(id: string, data: Partial<Node>): Promise<Node> {
    const response = await axiosInstance.put(`node-families/${id}/`, data);
    return response.data;
  },

  // Delete node
  async deleteNode(id: string): Promise<void> {
    await axiosInstance.delete(`node-families/${id}/`);
  },

  // Deploy/Activate a version
  async deployNodeVersion(id: string, version: number): Promise<{ status: string }> {
    const response = await axiosInstance.post(`node-families/${id}/versions/${version}/deploy/`);
    return response.data;
  },

  // Undeploy a version
  async undeployNodeVersion(id: string, version: number): Promise<{ status: string }> {
    const response = await axiosInstance.post(`node-families/${id}/versions/${version}/undeploy/`);
    return response.data;
  },

  // Get node versions
  async getNodeVersions(id: string): Promise<NodeVersion[]> {
    const response = await axiosInstance.get(`node-families/${id}/versions/`);
    return response.data;
  },

  // Get specific node version
  async getNodeVersion(id: string, version: number): Promise<NodeVersion> {
    const response = await axiosInstance.get(`node-families/${id}/versions/${version}/`);
    return response.data;
  },

  // Create a new version
  async createNodeVersion(id: string, fromVersion: number): Promise<NodeVersion> {
    const response = await axiosInstance.post(`node-families/${id}/versions/`, { from_version: fromVersion });
    return response.data;
  },

  // Activate node version (will deactivate other active nodes) - keeping for compatibility
  async activateNodeVersion(id: string, version: number): Promise<Node> {
    const response = await this.deployNodeVersion(id, version);
    // Return updated node data
    return await this.getNode(id);
  },

  // Get currently active node across the system
  async getActiveNode(): Promise<Node | null> {
    try {
      const nodes = await this.getAllNodes();
      if (!Array.isArray(nodes)) return null;
      return nodes.find(node => node.active_version !== null) || null;
    } catch (error) {
      console.error('Error fetching active node:', error);
      return null;
    }
  },

  // Create node
  async createNode(data: Partial<Node>): Promise<Node> {
    const response = await axiosInstance.post('node-families/', data);
    return response.data;
  },

  // Add parameters to node
  async addParametersToNode(id: string, parameters: any[]): Promise<any> {
    const response = await axiosInstance.post(`node-families/${id}/versions/${1}/add_parameter/`, { parameters });
    return response.data;
  }
};
