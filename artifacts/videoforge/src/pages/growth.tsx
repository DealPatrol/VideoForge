import { useCallback, useEffect, useState } from 'react';
import { Link } from 'wouter';
import {
  Activity,
  Check,
  ChevronRight,
  Loader2,
  Pause,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

type Campaign = {
  id: string;
  name: string;
  niche: string;
  status: 'active' | 'paused';
  currentFollowers: number;
  goalFollowers: number;
  videosPerDay: number;
  approvalRequired: boolean;
  platforms: string[];
  lastRunAt: string | null;
};

type GrowthPost = {
  id: string;
  projectId: string;
  topic: string;
  seriesName: string;
  hook: string;
  hookVariants: string[];
  status: string;
  scheduledAt: string | null;
  performanceScore: number | null;
};

type Overview = {
  campaigns: Campaign[];
  posts: GrowthPost[];
  summary: {
    activeCampaigns: number;
    awaitingApproval: number;
    scheduled: number;
    published: number;
    winners: GrowthPost[];
  };
  guardrails: string[];
};

const emptyOverview: Overview = {
  campaigns: [],
  posts: [],
  summary: {
    activeCampaigns: 0,
    awaitingApproval: 0,
    scheduled: 0,
    published: 0,
    winners: [],
  },
  guardrails: [],
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }
  return response.json();
}

export default function GrowthPage() {
  const [overview, setOverview] = useState<Overview>(emptyOverview);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('100K Growth Sprint');
  const [niche, setNiche] = useState('AI tools tested on real businesses');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setOverview(await request<Overview>('/api/growth'));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not load Growth Autopilot',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const primaryCampaign = overview.campaigns[0];
  const progress = primaryCampaign
    ? Math.min(
        100,
        (primaryCampaign.currentFollowers / primaryCampaign.goalFollowers) *
          100,
      )
    : 0;

  const stats: Array<{ label: string; value: number; Icon: LucideIcon }> = [
    {
      label: 'Active plans',
      value: overview.summary.activeCampaigns,
      Icon: Activity,
    },
    {
      label: 'Needs approval',
      value: overview.summary.awaitingApproval,
      Icon: ShieldCheck,
    },
    { label: 'Scheduled', value: overview.summary.scheduled, Icon: Target },
    { label: 'Published', value: overview.summary.published, Icon: Play },
  ];

  const createCampaign = async () => {
    if (!name.trim() || !niche.trim()) return;
    setWorkingId('create');
    try {
      await request('/api/growth/campaigns', {
        method: 'POST',
        body: JSON.stringify({
          name,
          niche,
          videosPerDay: 2,
          platforms: ['youtube', 'instagram', 'tiktok', 'facebook'],
        }),
      });
      await load();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Could not create campaign',
      );
    } finally {
      setWorkingId(null);
    }
  };

  const runCycle = async (campaignId: string) => {
    setWorkingId(campaignId);
    try {
      await request(`/api/growth/campaigns/${campaignId}/run`, {
        method: 'POST',
        body: '{}',
      });
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not create the next content batch',
      );
    } finally {
      setWorkingId(null);
    }
  };

  const updateCampaign = async (campaign: Campaign) => {
    setWorkingId(campaign.id);
    try {
      await request(`/api/growth/campaigns/${campaign.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: campaign.status === 'active' ? 'paused' : 'active',
        }),
      });
      await load();
    } finally {
      setWorkingId(null);
    }
  };

  const approve = async (postId: string) => {
    setWorkingId(postId);
    try {
      await request(`/api/growth/posts/${postId}/approve`, {
        method: 'POST',
        body: '{}',
      });
      await load();
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-6 sm:p-8 overflow-hidden relative">
        <div className="relative z-10 max-w-3xl">
          <Badge className="mb-4 gap-1.5">
            <Rocket className="h-3.5 w-3.5" /> Growth Autopilot
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
            Build an original audience to 100K.
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Create retention-focused video batches, approve them, distribute
            platform-specific versions, and turn performance data into the next
            batch.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="bg-card/60">
            <CardContent className="p-4 sm:p-5">
              <Icon className="h-4 w-4 text-primary mb-3" />
              <div className="text-2xl sm:text-3xl font-semibold">{value}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading ? (
        <Card>
          <CardContent className="p-12 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </CardContent>
        </Card>
      ) : overview.campaigns.length === 0 ? (
        <Card className="border-primary/30">
          <CardHeader>
            <CardTitle>Start the 100K growth system</CardTitle>
            <CardDescription>
              The default is two original vertical videos per day with approval
              required before publishing.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-[1fr_1fr_auto] gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign name</Label>
              <Input
                id="campaign-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="campaign-niche">Audience promise</Label>
              <Input
                id="campaign-niche"
                value={niche}
                onChange={(event) => setNiche(event.target.value)}
              />
            </div>
            <Button
              onClick={createCampaign}
              disabled={workingId === 'create'}
              className="gap-2"
            >
              {workingId === 'create' ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}{' '}
              Create
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {overview.campaigns.map((campaign) => (
            <Card key={campaign.id} className="overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-card/50">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle>{campaign.name}</CardTitle>
                      <Badge
                        variant={
                          campaign.status === 'active' ? 'default' : 'secondary'
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                    <CardDescription>
                      {campaign.niche} · {campaign.videosPerDay} videos/day ·{' '}
                      {campaign.platforms.join(', ')}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateCampaign(campaign)}
                      disabled={workingId === campaign.id}
                      className="gap-1.5"
                    >
                      {campaign.status === 'active' ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      {campaign.status === 'active' ? 'Pause' : 'Resume'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => runCycle(campaign.id)}
                      disabled={
                        workingId === campaign.id ||
                        campaign.status !== 'active'
                      }
                      className="gap-1.5"
                    >
                      {workingId === campaign.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4" />
                      )}{' '}
                      Create next 6
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-5">
                <div className="flex justify-between text-sm mb-2">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-4 w-4 text-primary" />
                    {campaign.currentFollowers.toLocaleString()} followers
                  </span>
                  <span className="text-muted-foreground">
                    Goal {campaign.goalFollowers.toLocaleString()}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Production queue</CardTitle>
            <CardDescription>
              Every package includes three hook tests, a short script, visual
              directions, and captions for all four platforms.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.posts.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground">
                Run the first cycle to create six video packages.
              </div>
            ) : (
              overview.posts.slice(0, 12).map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl border border-border/70 p-4 flex flex-col sm:flex-row gap-4 sm:items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex gap-2 items-center mb-1">
                      <Badge variant="outline">{post.seriesName}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {post.status.replaceAll('_', ' ')}
                      </span>
                    </div>
                    <div className="font-medium truncate">{post.topic}</div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {post.hook}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.status === 'awaiting_approval' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => approve(post.id)}
                        disabled={workingId === post.id}
                        className="gap-1.5"
                      >
                        <Check className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    <Link href={`/projects/${post.projectId}`}>
                      <Button size="sm" variant="ghost" className="gap-1">
                        Open <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              Safe-growth rules
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overview.guardrails.map((rule) => (
              <div
                key={rule}
                className="flex gap-2 text-sm text-muted-foreground"
              >
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
