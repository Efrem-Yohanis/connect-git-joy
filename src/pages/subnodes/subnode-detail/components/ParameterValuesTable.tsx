import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SubnodeVersion } from "@/services/subnodeService";

interface ParameterValuesTableProps {
  selectedVersion: SubnodeVersion | null;
}

export function ParameterValuesTable({ selectedVersion }: ParameterValuesTableProps) {
  // Handle parameter_values as an array of objects with {id, parameter_key, value}
  const parameterEntries = selectedVersion?.parameter_values 
    ? Array.isArray(selectedVersion.parameter_values) 
      ? selectedVersion.parameter_values
      : Object.entries(selectedVersion.parameter_values).map(([key, value]) => ({ 
          id: key, 
          parameter_key: key, 
          value: String(value || '') 
        }))
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Parameter Values (Version {selectedVersion?.version || 'Unknown'})</CardTitle>
      </CardHeader>
      <CardContent>
        {parameterEntries.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parameter Key</TableHead>
                <TableHead>Parameter Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parameterEntries.map((param) => (
                <TableRow key={param.id || param.parameter_key}>
                  <TableCell className="font-medium">
                    {param.parameter_key}
                  </TableCell>
                  <TableCell className="font-mono text-sm bg-muted/30 px-2 py-1 rounded">
                    {param.value ? String(param.value) : <span className="text-muted-foreground italic">Empty</span>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No parameters defined for this version
          </div>
        )}
      </CardContent>
    </Card>
  );
}