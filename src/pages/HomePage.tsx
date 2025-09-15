
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
      } catch (error) {
        console.error('Failed to fetch git info:', error);
      }
    };
    
    fetchGitInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary-glow/10" />
        <div className="relative px-6 py-12">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Flow Orchestrator</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground via-primary to-primary-glow bg-clip-text text-transparent leading-tight">
              Safaricom ET Pipeline
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Manage and orchestrate your data flows with precision. Monitor deployments, 
              track performance, and scale your operations seamlessly.
            </p>
            
            <div className="flex gap-4 justify-center mt-8">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={() => navigate("/flows")}
              >
                <Workflow className="mr-2 h-5 w-5" />
                View Flows
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-primary/20 hover:bg-primary/5 transition-all duration-300"
                onClick={() => navigate("/nodes")}
              >
                <Network className="mr-2 h-5 w-5" />
                Manage Nodes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">System Overview</h2>
            <p className="text-muted-foreground">Real-time insights into your pipeline infrastructure</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card 
                key={stat.title} 
                className={`group cursor-pointer hover:shadow-2xl transition-all duration-500 border-0 bg-gradient-to-br ${stat.bgGradient} backdrop-blur-sm hover:scale-105 animate-fade-in`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => navigate(stat.route)}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {stat.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground font-medium">{detail.label}:</span>
                      <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
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
      <div className="px-6 py-12 bg-gradient-to-r from-background to-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Quick Actions</h2>
            <p className="text-muted-foreground">Get started with common tasks</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <Card 
                key={action.title}
                className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 bg-card/50 backdrop-blur-sm hover:bg-card/80 animate-fade-in"
                style={{ animationDelay: `${(index + 4) * 150}ms` }}
                onClick={() => navigate(action.route)}
              >
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-gradient-to-br from-primary/10 to-primary-glow/10 w-fit group-hover:scale-110 transition-transform duration-300">
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                  </div>
                  <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
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
      <div className="px-6 py-8 border-t border-border/50 bg-muted/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">System Operational</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString()}
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>Uptime: 99.9%</span>
              <span>Active Flows: 4</span>
              <span>Total Processes: 142</span>
              {gitInfo && (
                <div className="flex items-center gap-2">
                  <GitCommit className="h-4 w-4" />
                  <span className="font-mono">{gitInfo.lastCommit.hash}</span>
                  <span>by {gitInfo.lastCommit.author}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
