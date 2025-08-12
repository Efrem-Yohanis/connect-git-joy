
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
      const response = await axiosInstance.get('nodes/');
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
      const response = await axiosInstance.get(`nodes/${id}/`);
      console.log('✅ Node fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching node ${id}:`, error);
      throw error;
    }
  },

  // Update node
  async updateNode(id: string, data: Partial<Node>): Promise<Node> {
    const response = await axiosInstance.put(`nodes/${id}/`, data);
    return response.data;
  },

  // Delete node
  async deleteNode(id: string): Promise<void> {
    await axiosInstance.delete(`nodes/${id}/`);
  },

  // Deploy node
  async deployNode(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/deploy/`);
    return response.data;
  },

  // Undeploy node
  async undeployNode(id: string): Promise<{ status: string }> {
    const response = await axiosInstance.post(`nodes/${id}/undeploy/`);
    return response.data;
  },

  // Get node versions
  async getNodeVersions(id: string): Promise<NodeVersion[]> {
    const response = await axiosInstance.get(`nodes/${id}/versions/`);
    return response.data;
  },

  // Activate node version (will deactivate other active nodes)
  async activateNodeVersion(id: string, version: number): Promise<Node> {
    const response = await axiosInstance.post(`nodes/${id}/deployed/${version}/`);
    return response.data;
  },

  // Get specific node version details
  async getNodeVersion(id: string, version: number): Promise<NodeVersion> {
    console.log(`📡 Fetching node ${id} version ${version}...`);
    try {
      const response = await axiosInstance.get(`nodes/${id}/version/${version}/`);
      console.log('✅ Node version fetched successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error fetching node ${id} version ${version}:`, error);
      throw error;
    }
  },

  // Get currently active node across the system
  async getActiveNode(): Promise<Node | null> {
    try {
      const nodes = await this.getAllNodes();
      return nodes.find(node => node.active_version !== null) || null;
    } catch (error) {
      console.error('Error fetching active node:', error);
      return null;
    }
  },

  // Create node
  async createNode(data: Partial<Node>): Promise<Node> {
    const response = await axiosInstance.post('nodes/', data);
    return response.data;
  },

  // Import nodes from JSON file
  async importNodes(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('nodes/import/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Export all versions of a node
  async exportAllVersions(id: string): Promise<Blob> {
    const response = await axiosInstance.get(`nodes/${id}/export_all_versions/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Clone node
  async cloneNode(id: string): Promise<Node> {
    const response = await axiosInstance.post(`nodes/${id}/clone_node/`);
    return response.data;
  },

  // Delete specific node version
  async deleteNodeVersion(id: string, version: number): Promise<void> {
    await axiosInstance.delete(`nodes/${id}/delete_version/${version}/`);
  },

  // Deploy node version
  async deployNodeVersion(id: string, version: number): Promise<any> {
    const response = await axiosInstance.post(`nodes/${id}/deployed/${version}/`);
    return response.data;
  },

  // Undeploy node version
  async undeployNodeVersion(id: string, version: number): Promise<any> {
    const response = await axiosInstance.post(`nodes/${id}/undeploy_version/${version}/`);
    return response.data;
  },

  // Create new version from existing version
  async createNewVersion(id: string, currentVersion: number): Promise<NodeVersion> {
    const response = await axiosInstance.post(`nodes/${id}/${currentVersion}/create_version/`);
    return response.data;
  },

  // Export specific version
  async exportVersion(id: string, version: number): Promise<Blob> {
    const response = await axiosInstance.get(`nodes/${id}/versions/${version}/`, {
      responseType: 'blob',
    });
    return response.data;
  },

  // Add parameters to version
  async addParametersToVersion(id: string, version: number, parameterIds: string[]): Promise<any> {
    const response = await axiosInstance.patch(`nodes/${id}/version/${version}/add_parameter/`, {
      parameter_ids: parameterIds,
    });
    return response.data;
  },

  // Remove parameters from version
  async removeParametersFromVersion(id: string, version: number, parameterIds: string[]): Promise<any> {
    const response = await axiosInstance.patch(`nodes/${id}/version/${version}/remove_parameter/`, {
      parameter_ids: parameterIds,
    });
    return response.data;
  },

  // Update script file for version
  async updateScript(id: string, version: number, file: File): Promise<any> {
    const formData = new FormData();
    formData.append('script', file);
    const response = await axiosInstance.patch(`nodes/${id}/update_script/${version}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Start execution of node script
  async startExecution(id: string, version: number): Promise<any> {
    const response = await axiosInstance.post(`node/${id}/start_execution/${version}/`);
    return response.data;
  },

  // Stop execution of node script
  async stopExecution(id: string, version: number): Promise<any> {
    const response = await axiosInstance.post(`node/${id}/stop_execution/${version}/`);
    return response.data;
  },

  // Add parameters to node (legacy - kept for compatibility)
  async addParametersToNode(id: string, parameters: any[]): Promise<any> {
    const response = await axiosInstance.post(`nodes/${id}/parameters_add/`, { parameters });
    return response.data;
  }
};
