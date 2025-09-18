
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Workflow, Network, GitFork, Settings, Activity, TrendingUp, Zap, GitCommit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { gitService } from "@/services/gitService";

const stats = [
  { 
    title: "Active Flows", 
    icon: Workflow, 
    color: "text-primary",
    bgGradient: "from-primary/20 to-primary-glow/20",
    route: "/flows",
    details: [
      { label: "Total", value: "24" },
      { label: "Deployed", value: "12" },
      { label: "Draft/Undeployed", value: "8" },
      { label: "Running", value: "4" }
    ]
  },
  { 
    title: "Total Nodes", 
    icon: Network, 
    color: "text-info",
    bgGradient: "from-info/20 to-blue-400/20",
    route: "/nodes",
    details: [
      { label: "Total", value: "48" },
      { label: "Deployed", value: "32" },
      { label: "Draft/Undeployed", value: "16" }
    ]
  },
  { 
    title: "Subnodes", 
    icon: GitFork, 
    color: "text-success",
    bgGradient: "from-success/20 to-green-400/20",
    route: "/subnodes",
    details: [
      { label: "Total", value: "96" },
      { label: "Deployed", value: "64" },
      { label: "Draft/Undeployed", value: "32" }
    ]
  },
  { 
    title: "Parameters", 
    icon: Settings, 
    color: "text-warning",
    bgGradient: "from-warning/20 to-orange-400/20",
    route: "/parameters",
    details: [
      { label: "Total", value: "124" }
    ]
  },
];

const quickActions = [
  {
    title: "Create New Flow",
    description: "Start building a new pipeline",
    icon: Workflow,
    color: "text-primary",
    route: "/flows"
  },
  {
    title: "Monitor System",
    description: "View real-time performance",
    icon: Activity,
    color: "text-info",
    route: "/flows"
  },
  {
    title: "View Analytics",
    description: "Analyze pipeline metrics",
    icon: TrendingUp,
    color: "text-success",
    route: "/flows"
  }
];

export function HomePage() {
  const navigate = useNavigate();
  const [gitInfo, setGitInfo] = useState<any>(null);

  useEffect(() => {
    const fetchGitInfo = async () => {
      try {
        const info = await gitService.getLatestCommit();
        setGitInfo(info);
        console.log('Latest Git Commit Info:', {
          hash: info.lastCommit.hash,
          message: info.lastCommit.message,
          author: info.lastCommit.author,
          date: new Date(info.lastCommit.date).toLocaleString(),
          branch: info.lastCommit.branch,
          repository: info.repository.name
        });
      } catch (error) {
        console.error('Failed to fetch git info:', error);
      }
    };
    
    fetchGitInfo();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="px-6 py-12 border-b border-border bg-card">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted border border-border">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Flow Orchestrator</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Safaricom ET Pipeline
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage and orchestrate your data flows with precision. Monitor deployments, 
            track performance, and scale your operations seamlessly.
          </p>
          
          <div className="flex gap-4 justify-center mt-8">
            <Button 
              size="lg" 
              onClick={() => navigate("/flows")}
            >
              <Workflow className="mr-2 h-5 w-5" />
              View Flows
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate("/nodes")}
            >
              <Network className="mr-2 h-5 w-5" />
              Manage Nodes
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">System Overview</h2>
            <p className="text-muted-foreground">Real-time insights into your pipeline infrastructure</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className="cursor-pointer hover:bg-muted/50 transition-colors border border-border bg-card"
                onClick={() => navigate(stat.route)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 bg-muted">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stat.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-medium">{detail.label}:</span>
                      <span className="text-lg font-bold text-foreground">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 py-12 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Quick Actions</h2>
            <p className="text-muted-foreground">Get started with common tasks</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card 
                key={action.title}
                className="cursor-pointer hover:bg-muted/50 transition-colors border border-border bg-card"
                onClick={() => navigate(action.route)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-muted w-fit">
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {action.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="px-6 py-8 border-t border-border bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success"></div>
                <span className="text-sm font-medium text-foreground">System Operational</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-6">
                <span>Uptime: 99.9%</span>
                <span>Active Flows: 4</span>
                <span>Total Processes: 142</span>
              </div>
              {gitInfo && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 bg-muted/30 border border-border">
                  <div className="flex items-center gap-2">
                    <GitCommit className="h-4 w-4 text-primary" />
                    <span className="font-mono text-foreground">{gitInfo.lastCommit.hash}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
                    <span className="text-foreground font-medium">{gitInfo.lastCommit.message}</span>
                    <span>by {gitInfo.lastCommit.author}</span>
                    <span>{new Date(gitInfo.lastCommit.date).toLocaleDateString()}</span>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 font-medium">{gitInfo.lastCommit.branch}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
