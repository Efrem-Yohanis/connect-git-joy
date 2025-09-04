import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import { Loading } from "@/components/ui/loading";

interface NodeVersionParameter {
  id: string;
  parameter_id: string;
  key: string;
  value: string;
  datatype: string;
}

interface PropertiesSectionProps {
  properties: NodeVersionParameter[];
  loading: boolean;
}

export function PropertiesSection({ properties, loading }: PropertiesSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProperties = useMemo(() => {
    return properties.filter(property =>
      property.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.value.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  const totalPages = Math.ceil(filteredProperties.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProperties = filteredProperties.slice(startIndex, startIndex + pageSize);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parameters</CardTitle>
        </CardHeader>
        <CardContent>
          <Loading text="Loading parameters..." size="sm" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameters ({properties.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Page Size Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search parameters..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Show:</span>
            <Select value={pageSize.toString()} onValueChange={(value) => {
              setPageSize(parseInt(value));
              setCurrentPage(1);
            }}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="15">15</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="25">25</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Parameters Table */}
        {filteredProperties.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Parameter Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Data Type</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedProperties.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.key}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {property.value || "—"}
                      </code>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground capitalize">
                        {property.datatype}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredProperties.length)} of {filteredProperties.length} parameters
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    className="px-3 py-1 text-sm border rounded disabled:opacity-50"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {searchTerm ? "No parameters match your search." : "No parameters available for this node version."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}