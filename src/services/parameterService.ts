import { useState, useEffect } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Parameter interfaces based on the API documentation
export interface Parameter {
  id: string;
  node: string;
  key: string;
  default_value: string;
  required: boolean;
  last_updated_by: string | null;
  last_updated_at: string;
  is_active: boolean;
  datatype: string;
}

export interface CreateParameterRequest {
  key: string;
  default_value: string;
  required: boolean;
  datatype: string;
}

// API Service Functions
export const parameterService = {
  // List all parameters
  async getParameters(): Promise<Parameter[]> {
    const response = await axiosInstance.get('parameters/');
    return response.data;
  },

  // Get single parameter
  async getParameter(id: string): Promise<Parameter> {
    const response = await axiosInstance.get(`parameters/${id}/`);
    return response.data;
  },

  // Create new parameter
  async createParameter(data: CreateParameterRequest): Promise<Parameter> {
    const response = await axiosInstance.post('parameters/', data);
    return response.data;
  },

  // Update parameter (partial update)
  async updateParameter(id: string, data: Partial<CreateParameterRequest>): Promise<Parameter> {
    const response = await axiosInstance.patch(`parameters/${id}/`, data);
    return response.data;
  },

  // Delete parameter
  async deleteParameter(id: string): Promise<void> {
    await axiosInstance.delete(`parameters/${id}/`);
  },

  // Deploy parameter
  async deployParameter(id: string): Promise<Parameter> {
    const response = await axiosInstance.post(`parameters/${id}/deploy/`);
    return response.data;
  },

  // Undeploy parameter
  async undeployParameter(id: string): Promise<Parameter> {
    const response = await axiosInstance.post(`parameters/${id}/undeploy/`);
    return response.data;
  },

  // Export parameter JSON
  async exportParameter(id: string): Promise<Blob> {
    const response = await axiosInstance.get(`parameters/${id}/export/`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Import parameter JSON
  async importParameter(file: File): Promise<Parameter> {
    const formData = new FormData();
    formData.append('file', file);
    const response = await axiosInstance.post('parameters/import_json/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Clone parameter
  async cloneParameter(id: string): Promise<Parameter> {
    const response = await axiosInstance.post(`parameters/${id}/clone/`);
    return response.data;
  },
};

// Custom hook for parameters list
export const useParameters = () => {
  const [data, setData] = useState<Parameter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParameters = async () => {
      try {
        console.log('Loading parameters from API...');
        const parameters = await parameterService.getParameters();
        console.log('Parameters loaded successfully:', parameters);
        setData(parameters);
        setError(null);
      } catch (err: any) {
        console.error('Error loading parameters:', err);
        setError(err.response?.data?.error || err.message || 'Error fetching parameters');
      } finally {
        setLoading(false);
      }
    };

    loadParameters();
  }, []);

  const refetch = async () => {
    setLoading(true);
    try {
      const parameters = await parameterService.getParameters();
      setData(parameters);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching parameters');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};

// Custom hook for single parameter
export const useParameter = (id: string) => {
  const [data, setData] = useState<Parameter | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadParameter = async () => {
      try {
        setLoading(true);
        const parameter = await parameterService.getParameter(id);
        setData(parameter);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.error || err.message || 'Error fetching parameter');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadParameter();
  }, [id]);

  const refetch = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const parameter = await parameterService.getParameter(id);
      setData(parameter);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Error fetching parameter');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, refetch };
};