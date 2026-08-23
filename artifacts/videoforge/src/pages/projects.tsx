import { useListProjects } from '@workspace/api-client-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Search, Plus, Calendar, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';

export default function ProjectsPage() {
  const { data: projects, isLoading } = useListProjects();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (!searchQuery) return projects;
    const lowerQuery = searchQuery.toLowerCase();
    return projects.filter(p => 
      p.title.toLowerCase().includes(lowerQuery) || 
      (p.description && p.description.toLowerCase().includes(lowerQuery)) ||
      p.status.toLowerCase().includes(lowerQuery)
    );
  }, [projects, searchQuery]);

  return (
    <div className="p-8 space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Projects</h1>
          <p className="text-muted-foreground mt-1">Manage all your video creations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search projects..." 
              className="pl-9 bg-card/50 border-border/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/projects/new">
            <Button className="flex items-center gap-2 whitespace-nowrap">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-auto pb-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 rounded-xl bg-card/30 animate-pulse border border-border/30" />
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-border/50 rounded-xl bg-card/10">
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "No projects found matching your search." : "You haven't created any projects yet."}
            </p>
            {!searchQuery && (
              <Link href="/projects/new">
                <Button>Create your first project</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="group hover:border-primary/50 transition-colors cursor-pointer bg-card/50 border-border/50 h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-background/80 backdrop-blur-sm p-1.5 rounded-full border border-border">
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  
                  <CardHeader className="p-5 pb-3">
                    <div className="flex justify-between items-start mb-3">
                      <StatusBadge status={project.status} />
                    </div>
                    <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors pr-8">
                      {project.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                      {project.description || 'No description provided.'}
                    </p>
                    <div className="flex items-center gap-2 mt-auto text-xs text-muted-foreground border-t border-border/30 pt-3">
                      <Calendar className="w-3.5 h-3.5" />
                      Updated {format(new Date(project.updatedAt), 'MMM d, yyyy')}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
