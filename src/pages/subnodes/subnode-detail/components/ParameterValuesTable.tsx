import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SubnodeVersionWithParametersByNodeVersion } from "@/services/subnodeService";
import { useState } from "react";

interface ParameterValuesTableProps {
  selectedVersion: SubnodeVersionWithParametersByNodeVersion | null;
}

export function ParameterValuesTable({ selectedVersion }: ParameterValuesTableProps) {
  const [selectedNodeVersion, setSelectedNodeVersion] = useState<string>("");

  if (!selectedVersion) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Parameter Values</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No version selected</p>
        </CardContent>
      </Card>
    );
  }

  // Check if we have parameter values by node version (detailed view)
  if (selectedVersion.parameter_values_by_nodeversion && selectedVersion.parameter_values_by_nodeversion.length > 0) {
    // Set default selected node version if not set
    if (!selectedNodeVersion && selectedVersion.parameter_values_by_nodeversion.length > 0) {
      setSelectedNodeVersion(selectedVersion.parameter_values_by_nodeversion[0].node_version.toString());
    }

    // Find the currently selected version data
    const currentVersionData = selectedVersion.parameter_values_by_nodeversion.find(
      versionData => versionData.node_version.toString() === selectedNodeVersion
    );

    return (
      <Card>
        <CardHeader>
          <CardTitle>Parameter Values by Node Version</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Node Version:</label>
            <Select value={selectedNodeVersion} onValueChange={setSelectedNodeVersion}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select node version" />
              </SelectTrigger>
              <SelectContent>
                {selectedVersion.parameter_values_by_nodeversion.map((versionData) => (
                  <SelectItem 
                    key={versionData.node_version} 
                    value={versionData.node_version.toString()}
                  >
                    Node Version {versionData.node_version}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentVersionData ? (
            currentVersionData.parameter_values.length === 0 ? (
              <p className="text-muted-foreground">No parameter values found for node version {currentVersionData.node_version}</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Parameter Key</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Default Value</TableHead>
                    <TableHead>Data Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentVersionData.parameter_values.map((param, index) => (
                    <TableRow key={`${currentVersionData.node_version}-${param.parameter_key}-${index}`}>
                      <TableCell className="font-medium">{param.parameter_key}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{param.value}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{param.default_value}</Badge>
                      </TableCell>
                      <TableCell>{param.datatype}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )
          ) : (
            <p className="text-muted-foreground">Please select a node version</p>
          )}
        </CardContent>
      </Card>
    );
  }

  // Fallback to simple parameter values (list view)
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