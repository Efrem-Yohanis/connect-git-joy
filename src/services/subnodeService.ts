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
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
  name: string;
  is_selected: boolean;
  node: string;
}

export interface SubnodeDetail {
  id: string;
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
  name: string;
  is_selected: boolean;
  node: string;
}

export interface SubnodeVersion {
  id: string;
  version: number;
  is_active: boolean;
}

export interface ParameterValueRequest {
  value: string;
}

export interface ParameterValueResponse {
  id: string;
  parameter: string;
  subnode: string;
  value: string;
  last_updated_by: string;
  last_updated_at: string;
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

  // Update subnode
  async updateSubnode(id: string, data: Partial<SubnodeDetail>): Promise<SubnodeDetail> {
    const response = await axiosInstance.put(`subnodes/${id}/`, data);
    return response.data;
  },

  // Delete subnode
  async deleteSubnode(id: string): Promise<{ detail: string }> {
    const response = await axiosInstance.delete(`subnodes/${id}/`);
    return response.data;
  },

  // Create new subnode
  async createSubnode(data: Partial<SubnodeDetail>): Promise<SubnodeDetail> {
    const response = await axiosInstance.post('subnodes/', data);
    return response.data;
  },

  // Update parameter value
  async updateParameterValue(parameterValueId: string, parameterData: ParameterValueRequest): Promise<ParameterValueResponse> {
    const response = await axiosInstance.patch(`parameter-values/${parameterValueId}/`, parameterData);
    return response.data;
  },

  // List all versions
  async getSubnodeVersions(id: string): Promise<SubnodeVersion[]> {
    const response = await axiosInstance.get(`subnodes/${id}/versions/`);
    return response.data;
  },

  // Activate specific version
  async activateVersion(id: string, version: number): Promise<{ id: string; version: number; is_active: boolean }> {
    const response = await axiosInstance.post(`subnodes/${id}/activate-version/`, { version });
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

// Custom hook for fetching subnode versions
export const useSubnodeVersions = (id: string) => {
  const [data, setData] = useState<SubnodeVersion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadVersions = async () => {
      try {
        setLoading(true);
        const versions = await subnodeService.getSubnodeVersions(id);
        setData(versions);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching subnode versions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadVersions();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const versions = await subnodeService.getSubnodeVersions(id);
      setData(versions);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching subnode versions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};