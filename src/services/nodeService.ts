
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

export interface NodeVersionDetail {
  id: string;
  version: number;
  state: string;
  changelog: string;
  family: string;
  family_name: string;
  script_url: string;
  parameters: Array<{
    id: string;
    parameter_id: string;
    key: string;
    value: string;
    datatype: string;
  }>;
  subnodes: Array<{
    id: string;
    name: string;
    active_version: number;
    parameter_values: Record<string, string>;
  }>;
  created_at: string;
  created_by: string;
}

export interface NodeVersion {
  version: number;
  is_deployed?: boolean;
  parameters: NodeParameter[];
  subnodes: Subnode[];
}

export interface Node {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  is_deployed: boolean;
  active_version?: number | null;
  total_versions?: number;
  published_version?: {
    id: string;
    version: number;
    state: string;
    changelog: string;
    family: string;
    family_name: string;
    script_url: string;
    parameters: Array<{
      id: string;
      parameter_id: string;
      key: string;
      value: string;
      datatype: string;
    }>;
    subnodes: Array<{
      id: string;
      name: string;
      active_version: number;
      parameter_values: Record<string, string>;
    }>;
    created_at: string;
    created_by: string;
  };
  versions: NodeVersion[];
}

// API Service Functions
export const nodeService = {
  // List all nodes
  async getAllNodes(): Promise<Node[]> {
    console.log('📡 Fetching all nodes...');
    try {
      const response = await axiosInstance.get('node-families/');
      console.log('✅ Nodes fetched successfully:', response.data);
      // Return the results array if API returns object with results, otherwise return data directly
      return Array.isArray(response.data) ? response.data : (response.data.results || []);
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

  // Get node versions list
  async getNodeVersions(id: string): Promise<NodeVersionDetail[]> {
    const response = await axiosInstance.get(`node-families/${id}/versions/`, {
      data: {
        paramerty_ids: []
      }
    });
    return response.data;
  },

  // Get specific node version detail
  async getNodeVersionDetail(id: string, version: number): Promise<NodeVersionDetail> {
    const response = await axiosInstance.get(`node-families/${id}/versions/${version}/`, {
      data: {
        paramerty_ids: []
      }
    });
    return response.data;
  },

  // Create a new version (legacy - for compatibility)
  async createNewNodeVersion(id: string, fromVersion: number): Promise<NodeVersion> {
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

  // Create node family
  async createNodeFamily(data: { name: string; description: string; created_by: string }): Promise<Node> {
    const response = await axiosInstance.post('node-families/create/', data);
    return response.data;
  },

  // Create initial version
  async createNodeVersion(id: string, data: { version: number; changelog: string }): Promise<any> {
    const response = await axiosInstance.post(`node-families/${id}/versions/`, data);
    return response.data;
  },

  // Upload script for version
  async uploadVersionScript(id: string, version: number, scriptFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('script', scriptFile);
    
    const response = await axiosInstance.patch(`node-families/${id}/versions/${version}/script/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Create node version with changelog
  async createNodeVersionWithChangelog(id: string, changelog: string): Promise<any> {
    // Get the latest version number first
    const versions = await this.getNodeVersions(id);
    const latestVersion = Math.max(...versions.map(v => v.version));
    const newVersion = latestVersion + 1;
    
    const response = await axiosInstance.post(`node-families/${id}/versions/`, {
      version: newVersion,
      changelog: changelog,
      source_version: null
    });
    return response.data;
  },

  // Create node (legacy - keeping for compatibility)
  async createNode(data: Partial<Node>): Promise<Node> {
    const response = await axiosInstance.post('node-families/', data);
    return response.data;
  },

  // Add parameters to node
  async addParametersToNode(id: string, parameters: any[]): Promise<any> {
    const response = await axiosInstance.post(`node-families/${id}/versions/${1}/add_parameter/`, { parameters });
    return response.data;
  },

  // Get specific node version for editing
  async getNodeVersion(id: string, version: number): Promise<NodeVersionDetail> {
    const response = await axiosInstance.get(`node-families/${id}/versions/${version}/`, {
      data: {
        paramerty_ids: []
      }
    });
    return response.data;
  },

  // Add parameters to version
  async addParametersToVersion(nodeId: string, version: number, parameterIds: string[]): Promise<any> {
    const response = await axiosInstance.post(`node-families/${nodeId}/versions/${version}/add_parameter/`, {
      parameter_ids: parameterIds
    });
    return response.data;
  },

  // Remove parameters from version
  async removeParametersFromVersion(nodeId: string, version: number, parameterIds: string[]): Promise<any> {
    const response = await axiosInstance.post(`node-families/${nodeId}/versions/${version}/remove_parameter/`, {
      parameter_ids: parameterIds
    });
    return response.data;
  },

  // Start execution - Updated API
  async startExecution(familyId: string, version: number, subnodeId?: string, parameters?: any): Promise<any> {
    const payload: any = {
      family_id: familyId,
      version: version
    };
    
    if (subnodeId) payload.subnode_id = subnodeId;
    if (parameters) payload.parameters = parameters;
    
    const response = await axiosInstance.post('executions/start/', payload);
    return response.data;
  },

  // Stop execution - Updated API
  async stopExecution(executionId: string): Promise<any> {
    const response = await axiosInstance.post(`executions/${executionId}/stop/`);
    return response.data;
  },

  // Get execution status - New API
  async getExecutionStatus(executionId: string): Promise<any> {
    const response = await axiosInstance.get(`executions/${executionId}/status/`);
    return response.data;
  },

  // Legacy methods - keeping for backward compatibility but deprecated
  async executeNode(familyId: string, versionId: string, subnodeId: string): Promise<any> {
    console.warn('executeNode is deprecated, use startExecution instead');
    return this.startExecution(familyId, parseInt(versionId), subnodeId);
  },

  async stopNodeExecution(executionId: string): Promise<any> {
    console.warn('stopNodeExecution is deprecated, use stopExecution instead');
    return this.stopExecution(executionId);
  },

  async getExecutionLogs(executionId: string): Promise<any> {
    console.warn('getExecutionLogs is deprecated, use getExecutionStatus instead');
    return this.getExecutionStatus(executionId);
  },

  // Update script file
  async updateScript(nodeId: string, version: number, scriptFile: File): Promise<any> {
    const formData = new FormData();
    formData.append('script', scriptFile);
    
    const response = await axiosInstance.patch(`nodes/${nodeId}/update_script/${version}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get script content for a specific version
  async getVersionScript(familyId: string, version: number): Promise<string> {
    try {
      // First get the version details to get the script_url
      const versionDetails = await this.getNodeVersion(familyId, version);
      
      if (!versionDetails.script_url) {
        throw new Error('No script URL available for this version');
      }
      
      console.log('🔍 Attempting to fetch script from:', versionDetails.script_url);
      
      // Try to fetch the script content directly from the script_url
      const response = await fetch(versionDetails.script_url);
      
      if (!response.ok) {
        console.error('❌ Script fetch failed:', response.status, response.statusText);
        
        if (response.status === 404) {
          // If direct access fails, this means the backend URL routing isn't configured
          // to serve script files. We need to inform the user about this backend issue.
          throw new Error('Script file not accessible - backend server needs to configure URL routing for script files');
        }
        
        throw new Error(`Failed to fetch script: ${response.status} ${response.statusText}`);
      }
      
      const scriptContent = await response.text();
      console.log('✅ Script content fetched successfully');
      return scriptContent;
      
    } catch (error) {
      console.error('❌ Error fetching script content:', error);
      throw error;
    }
  }
};
