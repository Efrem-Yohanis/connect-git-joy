// src/apis/ItemService.ts
import { useEffect, useState } from "react";
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/', // Your Django API URL
});

// Define the Item interface
export interface Item {
    id: string; // UUID as a string
    flow_nodes: any[]; // Adjust the type based on the expected structure
    version: number;
    created_at: string; // ISO date string
    updated_at: string; // ISO date string
    name: string;
    description: string;
    is_deployed: boolean;
    is_running: boolean;
    created_by: string;
}

// Function to fetch items from the API
export const fetchItems = async (): Promise<Item[]> => {
    const response = await axiosInstance.get('flows/'); // Adjust the endpoint as needed
    return response.data; // Assuming the response data is an array of items
};

// Custom hook to use the item data
export const useItems = () => {
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadItems = async () => {
            try {
                const items = await fetchItems();
                setData(items);
            } catch (err) {
                setError('Error fetching data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadItems();
    }, []);

    return { data, loading, error };
};




// src/apis/ItemService.ts
export const deleteItem = async (id: string): Promise<void> => {
    await axiosInstance.delete(`flows/${id}/`); // Adjust the endpoint as needed
};