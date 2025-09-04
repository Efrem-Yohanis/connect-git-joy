import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Square, RefreshCw } from 'lucide-react';
import { nodeService, type NodeVersionDetail } from '@/services/nodeService';

interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  message: string;
}

interface ExecutionStatus {
  isRunning: boolean;
  startTime?: string;
  duration?: number;
  executionId?: string;
  status?: string;
}

export function TestNodePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [nodeVersion, setNodeVersion] = useState<NodeVersionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNodeVersion = async () => {
      if (!id) return;
      try {
        setLoading(true);
        // Get the latest version or version 1 by default
        const versionData = await nodeService.getNodeVersionDetail(id, 1);
        setNodeVersion(versionData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch node version');
      } finally {
        setLoading(false);
      }
    };
    fetchNodeVersion();
  }, [id]);
  
  const [selectedSubnodeId, setSelectedSubnodeId] = useState<string>('');
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [executionStatus, setExecutionStatus] = useState<ExecutionStatus>({ isRunning: false });
  const logsEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [logs]);

  const addLog = (level: LogEntry['level'], message: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      level,
      message
    };
    setLogs(prev => [...prev, newLog]);
  };

  const handleStartExecution = async () => {
    if (!selectedSubnodeId || !nodeVersion) {
      toast({
        title: "Selection Required",
        description: "Please select a subnode to execute",
        variant: "destructive"
      });
      return;
    }

    const selectedSubnode = nodeVersion.subnodes.find(s => s.id === selectedSubnodeId);
    if (!selectedSubnode) return;

    try {
      setExecutionStatus({ isRunning: true, startTime: new Date().toISOString() });
      setLogs([]);
      
      addLog('info', `Starting execution of node "${nodeVersion.family_name}" with subnode: ${selectedSubnode.name}`);
      
      // Call the new start execution API
      const executionResult = await nodeService.startExecution(
        nodeVersion.family,
        nodeVersion.version,
        selectedSubnodeId
      );
      
      setExecutionStatus(prev => ({ 
        ...prev, 
        executionId: executionResult.id,
        status: executionResult.status
      }));
      
      addLog('info', `Execution started with ID: ${executionResult.id}`);
      addLog('info', `Status: ${executionResult.status}`);
      
      // Start polling for status
      startStatusPolling(executionResult.id);
      
    } catch (error: any) {
      addLog('error', `Execution failed: ${error.message}`);
      setExecutionStatus(prev => ({ 
        ...prev, 
        isRunning: false,
        duration: prev.startTime ? Date.now() - new Date(prev.startTime).getTime() : 0
      }));
    }
  };

  const startStatusPolling = (executionId: string) => {
    let pollCount = 0;
    const maxPolls = 100; // Stop after 100 polls (about 3 minutes)
    
    const pollStatus = async () => {
      if (pollCount >= maxPolls) {
        addLog('warning', 'Status polling stopped - maximum polling time reached');
        setExecutionStatus(prev => ({ ...prev, isRunning: false }));
        return;
      }
      
      try {
        const statusData = await nodeService.getExecutionStatus(executionId);
        
        // Update execution status
        setExecutionStatus(prev => ({
          ...prev,
          status: statusData.status,
          isRunning: statusData.status === 'running' || statusData.status === 'queued'
        }));
        
        // Parse logs if available
        if (statusData.log) {
          const logLines = statusData.log.split('\n').filter(line => line.trim());
          const newLogs: LogEntry[] = logLines.map((line, index) => ({
            id: `${executionId}-${index}`,
            timestamp: new Date().toISOString(),
            level: line.includes('ERROR') ? 'error' : 
                   line.includes('WARNING') ? 'warning' :
                   line.includes('DEBUG') ? 'debug' : 'info',
            message: line.replace(/^\[[^\]]+\]\s*/, '') // Remove timestamp prefix if exists
          }));
          
          setLogs(newLogs);
        }
        
        // Check if execution is complete
        if (statusData.status === 'completed' || statusData.status === 'failed' || statusData.status === 'stopped') {
          setExecutionStatus(prev => ({ 
            ...prev, 
            isRunning: false,
            duration: prev.startTime ? Date.now() - new Date(prev.startTime).getTime() : 0
          }));
          addLog('info', `Execution ${statusData.status}`);
          return;
        }
        
        // Continue polling if still running
        if (statusData.status === 'running' || statusData.status === 'queued') {
          pollCount++;
          setTimeout(pollStatus, 2000); // Poll every 2 seconds
        }
      } catch (error) {
        console.error('Error fetching status:', error);
        if (executionStatus.isRunning && pollCount < maxPolls) {
          pollCount++;
          setTimeout(pollStatus, 2000); // Continue polling even on error
        }
      }
    };
    
    pollStatus();
  };

  const handleStopExecution = async () => {
    if (!executionStatus.executionId) return;
    
    try {
      await nodeService.stopExecution(executionStatus.executionId);
      setExecutionStatus(prev => ({ 
        ...prev, 
        isRunning: false,
        status: 'stopped',
        duration: prev.startTime ? Date.now() - new Date(prev.startTime).getTime() : 0
      }));
      addLog('warning', 'Execution stopped by user');
    } catch (error: any) {
      addLog('error', `Failed to stop execution: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog('info', 'Logs cleared');
  };

  const getLogLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      case 'debug': return 'text-gray-500';
      default: return 'text-foreground';
    }
  };

  const getLogLevelBadge = (level: LogEntry['level']) => {
    const variants = {
      error: 'destructive',
      warning: 'secondary',
      debug: 'outline',
      info: 'default'
    } as const;
    return variants[level];
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !nodeVersion) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <p className="text-destructive">
              {error || 'Node version not found'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Test Node</h1>
          <p className="text-muted-foreground">Execute and monitor node performance</p>
        </div>
      </div>

      {/* Node Details */}
      <Card>
        <CardHeader>
          <CardTitle>Node Information</CardTitle>
          <CardDescription>Details about the selected node</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Family Name</label>
              <p className="text-base">{nodeVersion.family_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Version</label>
              <p className="text-base">{nodeVersion.version}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">State</label>
              <Badge variant={nodeVersion.state === 'published' ? 'default' : 'secondary'}>
                {nodeVersion.state}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Created At</label>
              <p className="text-base">{new Date(nodeVersion.created_at).toLocaleDateString()}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Changelog</label>
              <p className="text-base">{nodeVersion.changelog || 'No changelog available'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parameters</label>
              <p className="text-base">{nodeVersion.parameters?.length || 0} parameters</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subnodes</label>
              <p className="text-base">{nodeVersion.subnodes?.length || 0} subnodes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Control */}
      <Card>
        <CardHeader>
          <CardTitle>Execution Control</CardTitle>
          <CardDescription>Select a subnode and start execution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Select Subnode
              </label>
              <Select value={selectedSubnodeId} onValueChange={setSelectedSubnodeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subnode to execute" />
                </SelectTrigger>
                <SelectContent>
                  {nodeVersion.subnodes?.length ? (
                    nodeVersion.subnodes.map((subnode) => (
                      <SelectItem key={subnode.id} value={subnode.id}>
                        {subnode.name} (Active Version: {subnode.active_version})
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-subnodes" disabled>
                      No subnodes available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex gap-2">
              {executionStatus.isRunning ? (
                <Button onClick={handleStopExecution} variant="destructive" size="default">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Execution
                </Button>
              ) : (
                <Button 
                  onClick={handleStartExecution} 
                  disabled={!selectedSubnodeId || selectedSubnodeId === 'no-subnodes'}
                  size="default"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Execution
                </Button>
              )}
            </div>
          </div>

          {executionStatus.startTime && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Status: {executionStatus.status || (executionStatus.isRunning ? 'Running' : 'Completed')}</span>
              <span>Started: {new Date(executionStatus.startTime).toLocaleTimeString()}</span>
              {executionStatus.duration && (
                <span>Duration: {(executionStatus.duration / 1000).toFixed(2)}s</span>
              )}
              {executionStatus.executionId && (
                <span>ID: {executionStatus.executionId}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Execution Logs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>Real-time execution monitoring and debugging information</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              Clear Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 w-full border rounded-md p-4">
            {logs.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No logs yet. Start execution to see logs appear here.
              </p>
            ) : (
              <div className="space-y-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 font-mono text-sm">
                    <Badge variant={getLogLevelBadge(log.level)} className="text-xs">
                      {log.level.toUpperCase()}
                    </Badge>
                    <span className="text-xs text-muted-foreground min-w-20">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={getLogLevelColor(log.level)}>
                      {log.message}
                    </span>
                  </div>
                ))}
                <div ref={logsEndRef} />
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}