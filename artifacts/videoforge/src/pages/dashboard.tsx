import { useGetDashboard, useCreateProject } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Link, useLocation } from 'wouter';
import { Plus, Video, Play, FileText, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function DashboardPage() {
  const { data: stats, isLoading } = useGetDashboard();
  const [, setLocation] = useLocation();
  const createDemo = useCreateProject();

  const handleCreateDemo = () => {
    createDemo.mutate({
      data: {
        title: "Demo Project: AI Video Trends",
        description: "An example project analyzing AI video generation trends.",
        referenceTopic: "AI Video Generation Trends 2024"
      }
    }, {
      onSuccess: (project) => {
        setLocation(`/projects/${project.id}`);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Overview</h1>
          <p className="text-muted-foreground mt-1">Your video creation metrics and recent projects.</p>
        </div>
        <Link href="/projects/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider">Total Projects</CardDescription>
            <CardTitle className="text-4xl font-light">{stats?.totalProjects || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider">Completed Renders</CardDescription>
            <CardTitle className="text-4xl font-light">{stats?.completedRenders || 0}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardDescription className="font-mono text-xs uppercase tracking-wider">Drafts</CardDescription>
            <CardTitle className="text-4xl font-light">{stats?.draftProjects || 0}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {stats?.totalProjects === 0 ? (
        <Card className="border-dashed border-2 bg-transparent text-center p-12">
          <CardContent className="space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No projects yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Get started by creating a new project or explore a demo project to see how VideoForge works.
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Link href="/projects/new">
                <Button variant="default">Create Project</Button>
              </Link>
              <Button variant="outline" onClick={handleCreateDemo} disabled={createDemo.isPending}>
                {createDemo.isPending ? 'Creating...' : 'Create Demo Project'}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recent Projects</h2>
            <Link href="/projects">
              <Button variant="link" className="text-muted-foreground hover:text-primary pr-0 gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stats?.recentProjects?.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group hover:border-primary/50 transition-colors cursor-pointer bg-card/50 border-border/50 h-full flex flex-col">
                  <CardHeader className="p-4 pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <StatusBadge status={project.status} />
                      <span className="text-xs text-muted-foreground font-mono">
                        {format(new Date(project.createdAt), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-2 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {project.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground">
                      {project.status === 'rendering' ? (
                        <span className="flex items-center gap-1.5 text-yellow-500">
                          <Play className="w-3.5 h-3.5" /> Rendering... {project.renderProgress}%
                        </span>
                      ) : project.status === 'published' ? (
                        <span className="flex items-center gap-1.5 text-emerald-500">
                          <Video className="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5" /> Draft
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
