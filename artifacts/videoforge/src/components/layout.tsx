import { Link, useLocation } from 'wouter';
import { LayoutDashboard, Video, TrendingUp, Settings, Plus, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/projects', label: 'Projects', icon: Video },
    { href: '/trends', label: 'Trends', icon: TrendingUp },
    { href: '/growth', label: 'Growth', icon: Rocket },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside className="hidden sm:flex w-64 border-r border-border bg-card flex-col">
        <div className="p-6 h-16 flex items-center border-b border-border">
          <div className="flex items-center gap-2 text-primary">
            <Video className="h-6 w-6" />
            <span className="text-xl font-bold tracking-tight text-foreground font-mono">VideoForge</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? location === '/' : location.startsWith(item.href);
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/projects/new">
            <Button className="w-full flex items-center gap-2" variant="default">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <nav className="sm:hidden border-b border-border bg-card px-3 py-2 flex items-center gap-1 overflow-x-auto" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const isActive = item.href === '/' ? location === '/' : location.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`shrink-0 flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex-1 overflow-y-auto bg-background">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
