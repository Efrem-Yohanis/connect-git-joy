import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  LogOut, 
  FolderKanban, 
  Link as LinkIcon,
  Github,
  Video,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  title: string;
  link: string;
  githubLink: string;
  demoVideo: string;
  createdAt: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [formData, setFormData] = useState({
    title: "",
    link: "",
    githubLink: "",
    demoVideo: ""
  });

  useEffect(() => {
    // Check authentication
    const isAuth = localStorage.getItem("adminAuth");
    if (!isAuth) {
      navigate("/admin-site/login");
      return;
    }

    // Load projects from localStorage
    const savedProjects = localStorage.getItem("adminProjects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      // Add sample data if no projects exist
      const sampleProjects: Project[] = [
        {
          id: "1",
          title: "E-Commerce Platform",
          link: "https://example.com/ecommerce",
          githubLink: "https://github.com/example/ecommerce",
          demoVideo: "https://youtube.com/watch?v=sample1",
          createdAt: new Date("2024-01-15").toISOString()
        },
        {
          id: "2",
          title: "Task Management App",
          link: "https://example.com/taskmanager",
          githubLink: "https://github.com/example/taskmanager",
          demoVideo: "https://youtube.com/watch?v=sample2",
          createdAt: new Date("2024-02-20").toISOString()
        },
        {
          id: "3",
          title: "Real Estate Website",
          link: "https://example.com/realestate",
          githubLink: "https://github.com/example/realestate",
          demoVideo: "https://youtube.com/watch?v=sample3",
          createdAt: new Date("2024-03-10").toISOString()
        },
        {
          id: "4",
          title: "Social Media Dashboard",
          link: "https://example.com/socialdash",
          githubLink: "https://github.com/example/socialdash",
          demoVideo: "https://youtube.com/watch?v=sample4",
          createdAt: new Date("2024-04-05").toISOString()
        }
      ];
      localStorage.setItem("adminProjects", JSON.stringify(sampleProjects));
      setProjects(sampleProjects);
    }
  }, [navigate]);

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem("adminProjects", JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    toast.success("Logged out successfully");
    navigate("/admin-site/login");
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now().toString(),
      ...formData,
      createdAt: new Date().toISOString()
    };
    saveProjects([...projects, newProject]);
    setIsAddDialogOpen(false);
    setFormData({ title: "", link: "", githubLink: "", demoVideo: "" });
    toast.success("Project added successfully");
  };

  const handleEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    const updatedProjects = projects.map(p => 
      p.id === selectedProject.id 
        ? { ...p, ...formData }
        : p
    );
    saveProjects(updatedProjects);
    setIsEditDialogOpen(false);
    setSelectedProject(null);
    setFormData({ title: "", link: "", githubLink: "", demoVideo: "" });
    toast.success("Project updated successfully");
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter(p => p.id !== id);
      saveProjects(updatedProjects);
      toast.success("Project deleted successfully");
    }
  };

  const openEditDialog = (project: Project) => {
    setSelectedProject(project);
    setFormData({
      title: project.title,
      link: project.link,
      githubLink: project.githubLink,
      demoVideo: project.demoVideo
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (project: Project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/10 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <FolderKanban className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">Manage your project showcase</p>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardDescription>Total Projects</CardDescription>
              <CardTitle className="text-3xl">{projects.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-accent">
            <CardHeader className="pb-3">
              <CardDescription>With GitHub Links</CardDescription>
              <CardTitle className="text-3xl">
                {projects.filter(p => p.githubLink).length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card className="border-l-4 border-l-secondary">
            <CardHeader className="pb-3">
              <CardDescription>With Demo Videos</CardDescription>
              <CardTitle className="text-3xl">
                {projects.filter(p => p.demoVideo).length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Projects Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage and showcase your projects</CardDescription>
              </div>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Project Title</TableHead>
                    <TableHead className="font-semibold">Link</TableHead>
                    <TableHead className="font-semibold">GitHub</TableHead>
                    <TableHead className="font-semibold">Demo Video</TableHead>
                    <TableHead className="text-right font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                        No projects found. Click "Add Project" to get started.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedProjects.map((project) => (
                      <TableRow key={project.id} className="hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
                          {project.link ? (
                            <a 
                              href={project.link} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <LinkIcon className="w-3 h-3" />
                              View
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {project.githubLink ? (
                            <a 
                              href={project.githubLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline flex items-center gap-1"
                            >
                              <Github className="w-3 h-3" />
                              Repo
                            </a>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {project.demoVideo ? (
                            <Badge variant="secondary" className="gap-1">
                              <Video className="w-3 h-3" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline">None</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(project)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(project)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination Controls */}
            {filteredProjects.length > 0 && (
              <div className="flex items-center justify-between mt-4 px-2">
                <div className="text-sm text-muted-foreground">
                  Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="w-8 h-8"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Add Project Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogDescription>
              Add a new project to your showcase portfolio
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddProject}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Project Link</Label>
                <Input
                  id="link"
                  type="url"
                  placeholder="https://..."
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="githubLink">GitHub Link</Label>
                <Input
                  id="githubLink"
                  type="url"
                  placeholder="https://github.com/..."
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demoVideo">Demo Video URL</Label>
                <Input
                  id="demoVideo"
                  type="url"
                  placeholder="https://..."
                  value={formData.demoVideo}
                  onChange={(e) => setFormData({ ...formData, demoVideo: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Project</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update project information
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditProject}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Project Title *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-link">Project Link</Label>
                <Input
                  id="edit-link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-githubLink">GitHub Link</Label>
                <Input
                  id="edit-githubLink"
                  type="url"
                  value={formData.githubLink}
                  onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-demoVideo">Demo Video URL</Label>
                <Input
                  id="edit-demoVideo"
                  type="url"
                  value={formData.demoVideo}
                  onChange={(e) => setFormData({ ...formData, demoVideo: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Project Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{selectedProject?.title}</DialogTitle>
            <DialogDescription>
              Project details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-muted-foreground">Project Link</Label>
              <p className="mt-1">
                {selectedProject?.link ? (
                  <a 
                    href={selectedProject.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedProject.link}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">GitHub Repository</Label>
              <p className="mt-1">
                {selectedProject?.githubLink ? (
                  <a 
                    href={selectedProject.githubLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedProject.githubLink}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Demo Video</Label>
              <p className="mt-1">
                {selectedProject?.demoVideo ? (
                  <a 
                    href={selectedProject.demoVideo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {selectedProject.demoVideo}
                  </a>
                ) : (
                  <span className="text-muted-foreground">Not provided</span>
                )}
              </p>
            </div>
            <div>
              <Label className="text-muted-foreground">Created At</Label>
              <p className="mt-1">
                {selectedProject?.createdAt 
                  ? new Date(selectedProject.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                  : 'Unknown'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
