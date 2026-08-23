import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/layout';

// Pages
import DashboardPage from '@/pages/dashboard';
import ProjectsPage from '@/pages/projects';
import NewProjectPage from '@/pages/new-project';
import ProjectDetailPage from '@/pages/project-detail';
import TrendsPage from '@/pages/trends';
import SettingsPage from '@/pages/settings';

const queryClient = new QueryClient();

function Router() {
  return (
    <AppShell>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/projects" component={ProjectsPage} />
        <Route path="/projects/new" component={NewProjectPage} />
        <Route path="/projects/:projectId" component={ProjectDetailPage} />
        <Route path="/trends" component={TrendsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </AppShell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
