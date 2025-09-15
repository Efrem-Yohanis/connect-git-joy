import { 
  Workflow, 
  Network, 
  GitFork, 
  Settings, 
  GitCommitHorizontal,
  Home,
  AlertTriangle,
  FileText,
  Bell,
  BarChart3,
  Wrench,
  Server,
  ChevronRight
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useSection } from "@/contexts/SectionContext";
import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";

const configurationItems = [
  { title: "Flows", url: "/flows", icon: Workflow },
  { title: "Nodes", url: "/nodes", icon: Network },
  { title: "Subnodes", url: "/subnodes", icon: GitFork },
  { title: "Parameters", url: "/parameters", icon: Settings },
];

const alertItems = [
  { title: "Flow Alert", url: "/alerts/flows", icon: AlertTriangle },
  { title: "Node Alert", url: "/alerts/nodes", icon: Bell },
];

const reportItems = [
  { title: "Flow Report", url: "/reports/flows", icon: FileText },
  { title: "Node Report", url: "/reports/nodes", icon: BarChart3 },
];

const devToolItems = [
  { title: "DevTool", url: "/devtool", icon: Wrench },
];

const mediationInstances = [
  { 
    title: "Charging Gateway", 
    icon: Server, 
    url: "/mediations/charging"
  },
  { 
    title: "Convergent", 
    icon: Server, 
    url: "/mediations/convergent"
  },
  { 
    title: "NCC", 
    icon: Server, 
    url: "/mediations/ncc"
  }
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";
  const { setCurrentSection } = useSection();

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) =>
    isActive(path) 
      ? "bg-sidebar-accent text-sidebar-primary font-medium border-l-4 border-sidebar-primary" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  const handleSectionClick = (title: string) => {
    setCurrentSection(title);
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-sidebar-border px-6 py-4">
        {!collapsed && (
          <h1 className="text-lg font-bold text-green-600">
            Safaricom ET pipeline
          </h1>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <Workflow className="h-6 w-6 text-sidebar-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink 
                    to="/" 
                    end
                    className={getNavClasses("/")}
                    onClick={() => handleSectionClick("Dashboard")}
                  >
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Mediations Group */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Mediations
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mediationInstances.map((mediation) => (
                <SidebarMenuItem key={mediation.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={mediation.url} 
                      className={getNavClasses(mediation.url)}
                      onClick={() => handleSectionClick(mediation.title)}
                    >
                      <mediation.icon className="h-4 w-4" />
                      {!collapsed && <span>{mediation.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Alert Group */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Alert
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {alertItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      onClick={() => handleSectionClick(item.title)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Report Group */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Report
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      onClick={() => handleSectionClick(item.title)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Development Tools Group */}
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Development
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {devToolItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavClasses(item.url)}
                      onClick={() => handleSectionClick(item.title)}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}