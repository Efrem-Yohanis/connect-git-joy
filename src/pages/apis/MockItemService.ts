// Mock data service for development
import { useState, useEffect } from "react";

// Define the Item interface
export interface Item {
    id: string;
    flow_nodes: any[];
    version: number;
    created_at: string;
    updated_at: string;
    name: string;
    description: string;
    is_deployed: boolean;
    is_running: boolean;
    created_by: string;
}

// Mock data
const mockFlows: Item[] = [
    {
        "id": "84ef01fc-2b23-4ebf-a130-bd253690ad03",
        "flow_nodes": [],
        "version": 1,
        "created_at": "2025-07-22T19:26:11.782909Z",
        "updated_at": "2025-07-26T15:34:35.895717Z",
        "name": "My Flow",
        "description": "Test flow for development",
        "is_deployed": true,
        "is_running": false,
        "created_by": "efrem"
    },
    {
        "id": "e045180f-fc55-41ba-b792-a6a2d7ad1687",
        "flow_nodes": [],
        "version": 1,
        "created_at": "2025-07-26T15:45:46.572947Z",
        "updated_at": "2025-07-26T15:46:55.548678Z",
        "name": "Test Flow",
        "description": "Another test flow",
        "is_deployed": false,
        "is_running": false,
        "created_by": "developer"
    },
    {
        "id": "53c7a92c-aa8b-4896-886e-e3f5f31715f0",
        "flow_nodes": [],
        "version": 1,
        "created_at": "2025-08-06T21:33:26.888534Z",
        "updated_at": "2025-08-06T21:33:26.888565Z",
        "name": "New Flow Here",
        "description": "Test description",
        "is_deployed": false,
        "is_running": true,
        "created_by": "test"
    }
];

// Mock fetch function
export const fetchItems = async (): Promise<Item[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...mockFlows];
};

// Mock delete function
export const deleteItem = async (id: string): Promise<void> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = mockFlows.findIndex(flow => flow.id === id);
    if (index > -1) {
        mockFlows.splice(index, 1);
    }
};

// Custom hook to use the mock data
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