import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interfaces based on API response
export interface SubnodeListItem {
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
}

export interface SubnodeDetail {
  id: string;
  name: string;
  description: string;
  node: string;
  active_version: number | null;
  original_version: number;
  created_at: string;
  created_by: string;
  versions: SubnodeVersion[];
}

export interface SubnodeVersion {
  id: string;
  version: number;
  is_deployed: boolean;
  is_editable: boolean;
  updated_at: string;
  updated_by: string;
  version_comment: string | null;
  parameter_values: ParameterValue[];
}

export interface CreateSubnodeRequest {
  name: string;
  description: string;
  node: string;
}

export interface ParameterValueRequest {
  id: string;
  value: string;
}

export interface UpdateParameterValuesRequest {
  parameter_values: ParameterValueRequest[];
}

export interface EditWithParametersRequest {
  name?: string;
  description?: string;
  parameter_values?: ParameterValueRequest[];
}

export interface CloneSubnodeRequest {
  name?: string;
  [key: string]: any;
}

export interface CreateEditableVersionRequest {
  version_comment: string;
}

export interface VersionDetail {
  id: string;
  name: string;
  description: string;
  node: string;
  version: number;
  version_comment: string;
  is_deployed: boolean;
  is_editable: boolean;
  parameter_values: ParameterValue[];
}

export interface ParameterValue {
  id: string;
  parameter_key: string;
  value: string;
}

// API Service Functions
export const subnodeService = {
  // List all subnodes
  async getAllSubnodes(): Promise<SubnodeListItem[]> {
    const response = await axiosInstance.get('subnodes/');
    return response.data;
  },

  // Get single subnode detail
  async getSubnode(id: string): Promise<SubnodeDetail> {
    const response = await axiosInstance.get(`subnodes/${id}/`);
    return response.data;
  },

  // Update subnode (PATCH)
  async updateSubnode(id: string, data: Partial<SubnodeDetail>): Promise<SubnodeDetail> {
    const response = await axiosInstance.patch(`subnodes/${id}/`, data);
    return response.data;
  },

  // Delete subnode (all versions)
  async deleteSubnode(id: string): Promise<{ detail: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/`);
    return response.data;
  },

  // Create new subnode
  async createSubnode(data: CreateSubnodeRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post('subnodes/', data);
    return response.data;
  },

  // Update parameter values
  async updateParameterValues(id: string, data: UpdateParameterValuesRequest): Promise<any> {
    const response = await axiosInstance.patch(`subnodes/${id}/update_parameter_values/`, data);
    return response.data;
  },

  // Edit subnode with parameters
  async editWithParameters(id: string, data: EditWithParametersRequest): Promise<any> {
    const response = await axiosInstance.patch(`subnodes/${id}/edit_with_parameters/`, data);
    return response.data;
  },

  // Create editable version from active
  async createEditableVersion(id: string, data: CreateEditableVersionRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post(`subnodes/${id}/create_editable_version/`, data);
    return response.data;
  },

  // Activate/Deploy specific version
  async activateVersion(id: string, version: number): Promise<{ id: string; name: string; is_deployed: boolean; version: number; message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/activate_version/${version}/`);
    return response.data;
  },

  // Undeploy specific version
  async undeployVersion(id: string, version: number): Promise<{ message: string }> {
    const response = await axiosInstance.post(`subnodes/${id}/undeploy_version/${version}/`);
    return response.data;
  },

  // Export subnode
  async exportSubnode(id: string): Promise<any> {
    const response = await axiosInstance.get(`subnodes/${id}/export/`);
    return response.data;
  },

  // Import subnode
  async importSubnode(data: any): Promise<SubnodeDetail> {
    const response = await axiosInstance.post('subnodes/import/', data);
    return response.data;
  },

  // Clone subnode
  async cloneSubnode(id: string, data?: CloneSubnodeRequest): Promise<SubnodeDetail> {
    const response = await axiosInstance.post(`subnodes/${id}/clone/`, data || {});
    return response.data;
  },

  // Delete specific version
  async deleteSubnodeVersion(id: string, version: number): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/delete_version/${version}/`);
    return response.data;
  },

  // Delete all versions
  async deleteAllVersions(id: string): Promise<{ message: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/delete_all_versions/`);
    return response.data;
  },

  // Get version detail with parameter values
  async getVersionDetail(id: string, version: number): Promise<VersionDetail> {
    const response = await axiosInstance.get(`subnodes/${id}/version_detail/${version}/`);
    return response.data;
  },
};

// Custom hook for fetching all subnodes
export const useSubnodes = () => {
  const [data, setData] = useState<SubnodeListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSubnodes = async () => {
      try {
        const subnodes = await subnodeService.getAllSubnodes();
        setData(subnodes);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnodes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubnodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const subnodes = await subnodeService.getAllSubnodes();
      setData(subnodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for fetching single subnode
export const useSubnode = (id: string) => {
  const [data, setData] = useState<SubnodeDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadSubnode = async () => {
      try {
        setLoading(true);
        const subnode = await subnodeService.getSubnode(id);
        setData(subnode);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnode');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadSubnode();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const subnode = await subnodeService.getSubnode(id);
      setData(subnode);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnode');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook that returns versions from subnode data
export const useSubnodeVersions = (subnodeData: SubnodeDetail | null) => {
  const data = subnodeData?.versions || [];
  const loading = false;
  const error = null;

  const refetch = () => {
    // Versions are part of subnode data, so refetch is handled by parent
  };

  return { data, loading, error, refetch };
};