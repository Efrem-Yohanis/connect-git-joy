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
  version?: string;
  last_updated_at?: string;
  // Add other node properties as needed
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