import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Play, Square, RefreshCw } from 'lucide-react';
import { nodeService } from '@/services/nodeService';
import { useState as useNodeState } from 'react';

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
}

export function TestNodePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [node, setNode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNode = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const nodeData = await nodeService.getNode(id);
        setNode(nodeData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch node');
      } finally {
        setLoading(false);
      }
    };
    fetchNode();
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
    if (!selectedSubnodeId) {
      toast({
        title: "Selection Required",
        description: "Please select a subnode to execute",
        variant: "destructive"
      });
      return;
    }

    setExecutionStatus({ isRunning: true, startTime: new Date().toISOString() });
    setLogs([]);
    
    addLog('info', `Starting execution of node "${node?.name}" with subnode ID: ${selectedSubnodeId}`);
    addLog('debug', 'Initializing execution environment...');
    
    try {
      // Simulate execution process with mock logs
      await simulateExecution();
    } catch (error) {
      addLog('error', `Execution failed: ${error}`);
    } finally {
      setExecutionStatus(prev => ({ 
        ...prev, 
        isRunning: false,
        duration: prev.startTime ? Date.now() - new Date(prev.startTime).getTime() : 0
      }));
      addLog('info', 'Execution completed');
    }
  };

  const simulateExecution = async () => {
    const steps = [
      { delay: 1000, level: 'info' as const, message: 'Loading node configuration...' },
      { delay: 800, level: 'debug' as const, message: 'Validating input parameters...' },
      { delay: 1200, level: 'info' as const, message: 'Executing subnode logic...' },
      { delay: 2000, level: 'debug' as const, message: 'Processing data transformations...' },
      { delay: 1500, level: 'info' as const, message: 'Generating output results...' },
      { delay: 600, level: 'info' as const, message: 'Execution successful!' }
    ];

    for (const step of steps) {
      if (!executionStatus.isRunning) break;
      await new Promise(resolve => setTimeout(resolve, step.delay));
      addLog(step.level, step.message);
    }
  };

  const handleStopExecution = () => {
    setExecutionStatus(prev => ({ ...prev, isRunning: false }));
    addLog('warning', 'Execution stopped by user');
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

  if (error || !node) {
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
              {error || 'Node not found'}
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
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="text-base">{node.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Version</label>
              <p className="text-base">{node.version}</p>
            </div>
            <div className="col-span-2">
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-base">{node.description || 'No description available'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Parameters</label>
              <p className="text-base">{node.parameters?.length || 0} parameters</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Subnodes</label>
              <p className="text-base">{node.subnodes?.length || 0} subnodes</p>
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
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Select Subnode
              </label>
              <Select value={selectedSubnodeId} onValueChange={setSelectedSubnodeId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subnode to execute" />
                </SelectTrigger>
                <SelectContent>
                  {node.subnodes?.length ? (
                    node.subnodes.map((subnode: any) => (
                      <SelectItem key={subnode.id} value={subnode.id}>
                        {subnode.name} (v{subnode.version})
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
                <Button onClick={handleStopExecution} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button 
                  onClick={handleStartExecution} 
                  disabled={!selectedSubnodeId || selectedSubnodeId === 'no-subnodes'}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Execution
                </Button>
              )}
            </div>
          </div>

          {executionStatus.startTime && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Status: {executionStatus.isRunning ? 'Running' : 'Completed'}</span>
              <span>Started: {new Date(executionStatus.startTime).toLocaleTimeString()}</span>
              {executionStatus.duration && (
                <span>Duration: {(executionStatus.duration / 1000).toFixed(2)}s</span>
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