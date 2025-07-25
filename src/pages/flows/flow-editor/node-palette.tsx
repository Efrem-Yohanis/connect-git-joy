import { useState } from "react";
import { Search, Database, Code, Filter, Cpu, Network } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const nodeCategories = [
  {
    category: "Data Sources",
    nodes: [
      { type: "database", name: "Database Source", icon: Database },
      { type: "file", name: "File Input", icon: Network },
      { type: "api", name: "API Source", icon: Code },
    ]
  },
  {
    category: "Processing",
    nodes: [
      { type: "transform", name: "Data Transform", icon: Filter },
      { type: "compute", name: "Computation", icon: Cpu },
      { type: "filter", name: "Data Filter", icon: Filter },
    ]
  },
  {
    category: "Outputs",
    nodes: [
      { type: "database_sink", name: "Database Sink", icon: Database },
      { type: "file_output", name: "File Output", icon: Network },
      { type: "api_output", name: "API Output", icon: Code },
    ]
  }
];

interface NodePaletteProps {
  onAddNode: (nodeType: string, nodeName: string) => void;
}

export function NodePalette({ onAddNode }: NodePaletteProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  const handleDragStart = (event: React.DragEvent, nodeType: string, nodeName: string) => {
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ nodeType, nodeName }));
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 border-r border-border bg-muted/50 p-4">
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold mb-3">Node Palette</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-6">
          {filteredCategories.map((category) => (
            <div key={category.category}>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.nodes.map((node) => {
                  const IconComponent = node.icon;
                  return (
                    <Button
                      key={node.type}
                      variant="outline"
                      className="w-full justify-start h-auto p-3 cursor-grab active:cursor-grabbing"
                      draggable
                      onDragStart={(e) => handleDragStart(e, node.type, node.name)}
                    >
                      <IconComponent className="h-4 w-4 mr-3" />
                      <div className="text-left">
                        <div className="font-medium text-sm">{node.name}</div>
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}