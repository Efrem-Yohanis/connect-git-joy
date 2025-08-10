import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Node interface based on the API
export interface Node {
  id: string;
  name: string;
  description?: string;
  subnodes?: any[];
  version: number;
  created_at: string;
  updated_at: string;
  last_updated_by: string | null;
  last_updated_at: string;
}

export interface NodeVersion {
  id: string;
  version: number;
  is_active: boolean;
  created_by: string;
  created_at: string;
  description?: string;
}

export interface CreateNodeRequest {
  name: string;
  description: string;
  script: File | null;
}

// API Service Functions
export const nodeService = {
  // Get all nodes
  async getNodes(): Promise<Node[]> {
    const response = await axiosInstance.get('nodes/');
    return response.data;
  },

  // Get single node
  async getNode(id: string): Promise<Node> {
    const response = await axiosInstance.get(`nodes/${id}/`);
    return response.data;
  },

  // Create new node
  async createNode(data: CreateNodeRequest): Promise<Node> {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    if (data.script) {
      formData.append('script', data.script);
    }

    const response = await axiosInstance.post('nodes/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get node versions
  async getNodeVersions(id: string): Promise<NodeVersion[]> {
    const response = await axiosInstance.get(`nodes/${id}/versions/`);
    return response.data;
  },

  // Activate node version
  async activateNodeVersion(id: string, version: number): Promise<void> {
    await axiosInstance.post(`nodes/${id}/activate-version/`, { version });
  },

  // Create new node version
  async createNodeVersion(id: string, description?: string): Promise<NodeVersion> {
    const response = await axiosInstance.post(`nodes/${id}/create-version/`, { description });
    return response.data;
  },

  // Delete node
  async deleteNode(id: string): Promise<void> {
    await axiosInstance.delete(`nodes/${id}/`);
  },

  // Add parameters to a node
  async addParametersToNode(id: string, parameterIds: string[]): Promise<void> {
    await axiosInstance.post(`nodes/${id}/add_parameter/`, { parameter_ids: parameterIds });
  },

  // Remove parameters from a node
  async removeParametersFromNode(id: string, parameterIds: string[]): Promise<void> {
    await axiosInstance.delete(`nodes/${id}/remove-parameter/`, { data: { parameter_ids: parameterIds } });
  }
};

// Custom hook for nodes list
export const useNodes = () => {
  const [data, setData] = useState<Node[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNodes = async () => {
      try {
        console.log('Loading nodes from API...');
        const nodes = await nodeService.getNodes();
        console.log('Nodes loaded successfully:', nodes);
        setData(nodes);
        setError(null);
      } catch (err: any) {
        console.error('Error loading nodes:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching nodes');
      } finally {
        setLoading(false);
      }
    };

    loadNodes();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const nodes = await nodeService.getNodes();
      setData(nodes);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching nodes');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for single node
export const useNode = (id: string) => {
  const [data, setData] = useState<Node | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadNode = async () => {
      try {
        setLoading(true);
        const node = await nodeService.getNode(id);
        setData(node);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching node');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadNode();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const node = await nodeService.getNode(id);
      setData(node);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching node');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};
