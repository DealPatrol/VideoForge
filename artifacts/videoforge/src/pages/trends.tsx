import { useState } from 'react';
import { useLocation } from 'wouter';
import { useGetTrends, useAnalyzeTrend } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, TrendingUp, Lightbulb, Target, Flame, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TrendsPage() {
  const [, setLocation] = useLocation();
  const { data: trends, isLoading } = useGetTrends();
  const analyzeTrend = useAnalyzeTrend();
  
  const [topic, setTopic] = useState('');

  const handleAnalyze = () => {
    if (!topic.trim()) return;
    analyzeTrend.mutate({ data: { topic } });
  };

  const handleCreateFromTrend = (trendTopic: string) => {
    // Navigate to new project with topic prefilled
    // In a real app we'd pass state, here we just go to /projects/new
    // The user will have to type it again or we'd use URL params
    setLocation('/projects/new');
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono flex items-center gap-2">
          <TrendingUp className="w-8 h-8 text-primary" />
          Trend Analysis
        </h1>
        <p className="text-muted-foreground">Discover what's working on YouTube right now.</p>
      </div>

      <Card className="bg-card/50 border-primary/20 shadow-[0_0_30px_-15px_hsl(var(--primary))] overflow-hidden">
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Enter a niche or topic (e.g. 'Home Lab Setup')" 
                className="pl-10 h-14 text-lg bg-background border-primary/30 focus-visible:ring-primary/50"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
              />
            </div>
            <Button 
              size="lg" 
              className="w-full sm:w-auto h-14 px-8 text-lg"
              onClick={handleAnalyze}
              disabled={analyzeTrend.isPending || !topic.trim()}
            >
              {analyzeTrend.isPending ? 'Analyzing...' : 'Analyze Market'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6 flex-1">
        <h2 className="text-xl font-semibold tracking-tight">Recent Insights</h2>
        
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map(i => (
              <Card key={i} className="bg-card/30">
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !trends || trends.length === 0 ? (
          <div className="text-center p-12 bg-card/20 rounded-xl border border-border/50">
            <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No trend data yet</h3>
            <p className="text-muted-foreground">Analyze a topic to uncover formats and gaps.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {(analyzeTrend.data ? [analyzeTrend.data, ...trends.filter(t => t.id !== analyzeTrend.data.id)] : trends).map((trend) => (
              <Card key={trend.id} className="bg-card/50 border-border/50">
                <CardHeader className="pb-4 border-b border-border/30">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardDescription className="uppercase tracking-wider font-mono text-xs text-primary mb-1">
                        Topic Analysis
                      </CardDescription>
                      <CardTitle className="text-2xl">{trend.topic}</CardTitle>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleCreateFromTrend(trend.topic)} className="hidden sm:flex gap-2">
                      Create Project <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Flame className="w-4 h-4 text-orange-500" /> Winning Formats
                    </div>
                    <ul className="space-y-2">
                      {trend.popularFormats.map((f, i) => (
                        <li key={i} className="text-sm text-muted-foreground bg-background rounded-md px-3 py-2 border border-border/50">
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Target className="w-4 h-4 text-blue-500" /> Hook Patterns
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {trend.hookTypes.map((h, i) => (
                        <Badge key={i} variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">
                          {h}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 lg:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                      <Lightbulb className="w-4 h-4 text-yellow-500" /> Content Gaps
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {trend.contentGaps.map((gap, i) => (
                        <div key={i} className="text-sm p-3 rounded-md bg-yellow-500/5 border border-yellow-500/10 text-muted-foreground">
                          <span className="text-yellow-500 font-medium block mb-1">Opportunity {i+1}</span>
                          {gap}
                        </div>
                      ))}
                    </div>
                  </div>

                </CardContent>
                <div className="p-4 bg-muted/30 border-t border-border/30 text-sm">
                  <span className="font-medium text-foreground mr-2">Audience Insight:</span> 
                  <span className="text-muted-foreground">{trend.audienceInsights}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
