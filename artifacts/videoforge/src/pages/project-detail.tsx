import { useState, useEffect, useRef } from 'react';
import { useRoute, useLocation } from 'wouter';
import { 
  useGetProject, 
  useUpdateProject, 
  useGetConcepts, 
  useSelectConcept,
  useGetScript,
  useGenerateScript,
  useUpdateScript,
  useCheckOriginality,
  useListMedia,
  useGetVoiceover,
  useGenerateVoiceover,
  useGetRenderStatus,
  useStartRender,
  useGetPublishInfo,
  usePublishToYoutube,
  useSearchStock,
  useAddStockMedia,
  getGetProjectQueryKey,
  getGetScriptQueryKey,
  getListMediaQueryKey
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { OriginalityDisclaimer } from '@/components/originality-disclaimer';
import { StatusBadge } from '@/components/status-badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  Check, Sparkles, AlertTriangle, ShieldCheck, Play, Save, 
  Download, Upload, Youtube, RefreshCw, AlertCircle, Search, Settings2, ShieldAlert, VideoIcon, ImageIcon, Plus,
  ArrowRight
} from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

export default function ProjectDetailPage() {
  const [match, params] = useRoute('/projects/:projectId');
  const projectId = params?.projectId || '';
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const queryClient = useQueryClient();

  // Queries
  const { data: project, isLoading: projectLoading } = useGetProject(projectId, {
    query: { enabled: !!projectId, queryKey: getGetProjectQueryKey(projectId) }
  });
  const { data: concepts } = useGetConcepts(projectId, {
    query: { enabled: !!projectId && activeTab === 'overview' }
  });
  const { data: script } = useGetScript(projectId, {
    query: { enabled: !!projectId && (activeTab === 'script' || activeTab === 'voiceover'), queryKey: getGetScriptQueryKey(projectId) }
  });
  const { data: mediaAssets } = useListMedia(projectId, {
    query: { enabled: !!projectId && activeTab === 'media' }
  });
  const { data: voiceover } = useGetVoiceover(projectId, {
    query: { enabled: !!projectId && activeTab === 'voiceover' }
  });
  const { data: renderStatus } = useGetRenderStatus(projectId, {
    query: { 
      enabled: !!projectId && activeTab === 'render',
      refetchInterval: (query) => query.state.data?.status === 'rendering' ? 3000 : false
    }
  });
  const { data: publishInfo } = useGetPublishInfo(projectId, {
    query: { enabled: !!projectId && activeTab === 'publish' }
  });

  // Mutations
  const selectConcept = useSelectConcept();
  const generateScript = useGenerateScript();
  const updateScript = useUpdateScript();
  const checkOriginality = useCheckOriginality();
  const generateVoiceover = useGenerateVoiceover();
  const startRender = useStartRender();
  const publishYoutube = usePublishToYoutube();
  const addStockMedia = useAddStockMedia();

  // Script State & Auto-save
  const [scriptContent, setScriptContent] = useState('');
  const initializedScriptId = useRef<string | null>(null);
  const lastSavedScript = useRef('');

  useEffect(() => {
    if (script && initializedScriptId.current !== script.id) {
      initializedScriptId.current = script.id;
      setScriptContent(script.content);
      lastSavedScript.current = script.content;
    }
  }, [script]);

  const handleSaveScript = () => {
    if (scriptContent === lastSavedScript.current) return;
    updateScript.mutate({
      projectId,
      data: { content: scriptContent }
    }, {
      onSuccess: () => {
        lastSavedScript.current = scriptContent;
        queryClient.invalidateQueries({ queryKey: getGetScriptQueryKey(projectId) });
        toast.success('Script saved');
      }
    });
  };

  const [origResult, setOrigResult] = useState<any>(null);

  // Stock Media Search State
  const [stockQuery, setStockQuery] = useState('');
  const [debouncedStockQuery, setDebouncedStockQuery] = useState('');
  const [stockType, setStockType] = useState<'video' | 'photo'>('video');
  const [isStockOpen, setIsStockOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedStockQuery(stockQuery), 500);
    return () => clearTimeout(t);
  }, [stockQuery]);

  const { data: stockResults, isLoading: isStockLoading } = useSearchStock({
    query: debouncedStockQuery,
    type: stockType,
    perPage: 12
  }, {
    query: { enabled: !!debouncedStockQuery && isStockOpen }
  });

  const handleAddStock = (item: any) => {
    addStockMedia.mutate({
      projectId,
      data: {
        externalId: item.id,
        url: item.url,
        thumbnailUrl: item.thumbnailUrl,
        type: item.type === 'video' ? 'stock_video' : 'stock_photo',
        attribution: item.attribution,
        duration: item.duration,
        width: item.width,
        height: item.height
      }
    }, {
      onSuccess: () => {
        toast.success('Added to project media');
        queryClient.invalidateQueries({ queryKey: getListMediaQueryKey(projectId) });
      }
    });
  };

  if (!match || !projectId) return null;

  if (projectLoading) {
    return (
      <div className="p-8 space-y-8">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!project) return <div className="p-8">Project not found.</div>;

  return (
    <div className="p-8 space-y-6 h-full flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <StatusBadge status={project.status} />
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{project.title}</h1>
          </div>
          <p className="text-muted-foreground">{project.description || 'No description'}</p>
        </div>
        <div className="flex gap-2">
          {project.status === 'concepts' && (
            <Button variant="outline" onClick={() => setActiveTab('concepts')}>Review Concepts</Button>
          )}
          {project.status === 'ready' && (
            <Button onClick={() => setActiveTab('publish')} className="bg-emerald-500 hover:bg-emerald-600 text-white">
              Ready to Publish
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-6 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="script">Script</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="voiceover">Voiceover</TabsTrigger>
          <TabsTrigger value="render">Render</TabsTrigger>
          <TabsTrigger value="publish">Publish</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-y-auto pb-8">
          <TabsContent value="overview" className="m-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="col-span-1 md:col-span-2 bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Source Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.referenceUrl ? (
                    <div>
                      <Label className="text-xs text-muted-foreground">URL</Label>
                      <a href={project.referenceUrl} target="_blank" rel="noreferrer" className="block text-primary hover:underline truncate">
                        {project.referenceUrl}
                      </a>
                    </div>
                  ) : null}
                  {project.referenceTopic ? (
                    <div>
                      <Label className="text-xs text-muted-foreground">Topic</Label>
                      <p className="font-medium">{project.referenceTopic}</p>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
              
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Created</span>
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated</span>
                      <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {project.status === 'concepts' && concepts && concepts.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" /> Generated Concepts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {concepts.map(concept => (
                    <Card key={concept.id} className={`bg-card/50 border-border/50 flex flex-col ${project.selectedConceptId === concept.id ? 'border-primary ring-1 ring-primary' : ''}`}>
                      <CardHeader>
                        <CardTitle className="text-xl">{concept.title}</CardTitle>
                        <CardDescription className="text-primary font-medium">{concept.angle}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 space-y-4 text-sm">
                        <div>
                          <span className="font-semibold block mb-1">Hook:</span>
                          <p className="text-muted-foreground">{concept.hook}</p>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Target Audience:</span>
                          <p className="text-muted-foreground">{concept.targetAudience}</p>
                        </div>
                        <div>
                          <span className="font-semibold block mb-1">Structure:</span>
                          <p className="text-muted-foreground">{concept.structure}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full" 
                          variant={project.selectedConceptId === concept.id ? 'secondary' : 'default'}
                          disabled={selectConcept.isPending}
                          onClick={() => {
                            selectConcept.mutate({ projectId, conceptId: concept.id }, {
                              onSuccess: () => {
                                setActiveTab('script');
                                toast.success('Concept selected. Generating script...');
                              }
                            });
                          }}
                        >
                          {project.selectedConceptId === concept.id ? 'Selected' : 'Select Concept'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="script" className="m-0 h-full flex flex-col space-y-4 min-h-[500px]">
            <OriginalityDisclaimer />
            
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-mono">Script Editor</h2>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    checkOriginality.mutate({ projectId }, {
                      onSuccess: (data) => setOrigResult(data)
                    });
                  }}
                  disabled={checkOriginality.isPending}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" /> Check Originality
                </Button>
                <Button onClick={handleSaveScript} disabled={scriptContent === lastSavedScript.current || updateScript.isPending}>
                  <Save className="w-4 h-4 mr-2" /> {updateScript.isPending ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {origResult && (
              <Card className={`border ${origResult.riskLevel === 'high' ? 'border-destructive bg-destructive/10' : origResult.riskLevel === 'medium' ? 'border-yellow-500 bg-yellow-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
                <CardContent className="p-4 flex items-start gap-4">
                  <div className={`p-3 rounded-full ${origResult.riskLevel === 'high' ? 'bg-destructive/20 text-destructive' : origResult.riskLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {origResult.riskLevel === 'high' ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold flex items-center gap-2">
                      Originality Score: {origResult.score}/100 
                      <Badge variant={origResult.riskLevel === 'high' ? 'destructive' : 'default'} className="ml-2">
                        {origResult.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </h3>
                    <ul className="mt-2 space-y-1 text-sm list-disc list-inside ml-4 text-muted-foreground">
                      {origResult.issues.map((iss: string, i: number) => <li key={i}>{iss}</li>)}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {!script && !generateScript.isPending && (
              <div className="flex-1 flex flex-col items-center justify-center bg-card/20 rounded-xl border border-border/50 p-12 min-h-[300px]">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground mb-4">No script generated yet.</p>
                <Button onClick={() => generateScript.mutate({ projectId })}>
                  Generate Script from Concept
                </Button>
              </div>
            )}

            {generateScript.isPending && (
              <div className="flex-1 flex items-center justify-center min-h-[300px]">
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-muted-foreground font-mono animate-pulse">Drafting script...</p>
                </div>
              </div>
            )}

            {script && (
              <Textarea 
                value={scriptContent}
                onChange={(e) => setScriptContent(e.target.value)}
                className="flex-1 font-mono text-base resize-none bg-card/50 focus-visible:ring-1 focus-visible:ring-primary/50 min-h-[400px]"
                placeholder="Write your script here..."
              />
            )}
          </TabsContent>

          <TabsContent value="media" className="m-0 space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold font-mono">Media Assets</h2>
              <div className="flex gap-2">
                <Dialog open={isStockOpen} onOpenChange={setIsStockOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline"><Search className="w-4 h-4 mr-2" />Stock Library</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
                    <DialogHeader>
                      <DialogTitle>Stock Media Library</DialogTitle>
                      <DialogDescription>Search for high-quality stock videos and photos.</DialogDescription>
                    </DialogHeader>
                    
                    <div className="flex gap-2 my-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search for 'cyberpunk city' or 'typing fast'..." 
                          className="pl-9"
                          value={stockQuery}
                          onChange={(e) => setStockQuery(e.target.value)}
                        />
                      </div>
                      <div className="flex border rounded-md overflow-hidden">
                        <button 
                          className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium ${stockType === 'video' ? 'bg-primary/10 text-primary' : 'bg-background hover:bg-muted'}`}
                          onClick={() => setStockType('video')}
                        >
                          <VideoIcon className="w-4 h-4" /> Video
                        </button>
                        <button 
                          className={`px-3 py-2 flex items-center gap-1.5 text-sm font-medium ${stockType === 'photo' ? 'bg-primary/10 text-primary' : 'bg-background hover:bg-muted'}`}
                          onClick={() => setStockType('photo')}
                        >
                          <ImageIcon className="w-4 h-4" /> Photo
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto min-h-[300px]">
                      {isStockLoading ? (
                        <div className="flex items-center justify-center h-full">
                          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                      ) : !stockResults?.results?.length ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                          <Search className="w-8 h-8 mb-2 opacity-50" />
                          <p>{debouncedStockQuery ? 'No results found' : 'Search for media to get started'}</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {stockResults.results.map((item) => (
                            <div key={item.id} className="group relative rounded-md overflow-hidden border border-border bg-card">
                              <div className="aspect-[16/9] bg-muted relative">
                                <img src={item.thumbnailUrl} alt="thumbnail" className="w-full h-full object-cover" />
                                {item.type === 'video' && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                    <Play className="w-8 h-8 text-white/80" />
                                  </div>
                                )}
                              </div>
                              <div className="p-2 text-xs">
                                <p className="truncate font-medium text-foreground">{item.photographer}</p>
                                <p className="text-muted-foreground truncate">{item.duration ? `${item.duration}s` : 'Photo'}</p>
                              </div>
                              <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                <Button size="sm" onClick={() => handleAddStock(item)} disabled={addStockMedia.isPending}>
                                  <Plus className="w-4 h-4 mr-1" /> Add to Project
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
                <Button onClick={() => toast.info('Upload functionality would trigger native file picker here')}><Upload className="w-4 h-4 mr-2" />Upload Media</Button>
              </div>
            </div>

            {(!mediaAssets || mediaAssets.length === 0) ? (
              <div className="text-center p-12 bg-card/20 rounded-xl border border-border/50 border-dashed">
                <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No media assets added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {mediaAssets.map(asset => (
                  <Card key={asset.id} className="overflow-hidden bg-card/50">
                    <div className="aspect-video bg-muted relative group">
                      {asset.thumbnailUrl ? (
                        <img src={asset.thumbnailUrl} alt={asset.filename} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-muted-foreground/50" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button size="sm" variant="secondary">View</Button>
                      </div>
                    </div>
                    <div className="p-3 text-xs">
                      <p className="truncate font-medium">{asset.filename}</p>
                      <p className="text-muted-foreground capitalize mt-1 flex justify-between">
                        {asset.type} <span>{asset.duration ? `${asset.duration}s` : ''}</span>
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="voiceover" className="m-0 space-y-6 max-w-3xl mx-auto">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Voice Generation</CardTitle>
                <CardDescription>Convert your script to speech using AI voices.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!script ? (
                  <Alert className="bg-yellow-500/10 border-yellow-500/20 text-yellow-500">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertTitle>Missing Script</AlertTitle>
                    <p className="text-sm">You need to generate or write a script first.</p>
                  </Alert>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label>Selected Voice</Label>
                      <select className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                        <option value="alloy">Alloy (Neutral, Default)</option>
                        <option value="echo">Echo (Warm)</option>
                        <option value="fable">Fable (Expressive)</option>
                        <option value="onyx">Onyx (Deep)</option>
                      </select>
                    </div>

                    <div className="pt-4 border-t border-border/50">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium text-sm">Status</h4>
                        {voiceover ? (
                          <Badge variant="outline" className={
                            voiceover.status === 'ready' ? 'text-green-500 border-green-500/20 bg-green-500/10' :
                            voiceover.status === 'error' ? 'text-red-500 border-red-500/20 bg-red-500/10' :
                            'text-yellow-500 border-yellow-500/20 bg-yellow-500/10 animate-pulse'
                          }>
                            {voiceover.status.toUpperCase()}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not generated</span>
                        )}
                      </div>

                      {voiceover?.status === 'ready' && voiceover.url && (
                        <div className="bg-background border border-border p-4 rounded-lg flex items-center gap-4">
                          <Button size="icon" className="rounded-full flex-shrink-0"><Play className="w-4 h-4" /></Button>
                          <div className="flex-1">
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-primary w-1/3" />
                            </div>
                          </div>
                          <span className="text-xs font-mono text-muted-foreground">0:00 / {voiceover.duration}s</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="bg-muted/30 pt-6">
                <Button 
                  className="w-full gap-2" 
                  size="lg"
                  disabled={!script || generateVoiceover.isPending || voiceover?.status === 'generating'}
                  onClick={() => generateVoiceover.mutate({ projectId, data: { voice: 'alloy' } })}
                >
                  <RefreshCw className={`w-4 h-4 ${generateVoiceover.isPending ? 'animate-spin' : ''}`} />
                  {voiceover ? 'Regenerate Voiceover' : 'Generate Voiceover'}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="render" className="m-0 space-y-6 max-w-3xl mx-auto">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Render Video</CardTitle>
                <CardDescription>Compile all assets, script, and voiceover into the final video.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {renderStatus ? (
                  <div className="space-y-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium capitalize text-sm">{renderStatus.status}</span>
                      <span className="text-sm font-mono text-primary">{renderStatus.progress}%</span>
                    </div>
                    <Progress value={renderStatus.progress} className="h-3 bg-muted" indicatorClassName={
                      renderStatus.status === 'error' ? 'bg-destructive' : 
                      renderStatus.status === 'done' ? 'bg-emerald-500' : 'bg-primary'
                    } />
                    
                    {renderStatus.status === 'error' && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Render Failed</AlertTitle>
                        <p className="text-sm">{renderStatus.error}</p>
                      </Alert>
                    )}
                    
                    {renderStatus.status === 'done' && (
                      <div className="mt-6 flex justify-center">
                        <Button variant="outline" className="text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10" onClick={() => setActiveTab('publish')}>
                          Go to Publish <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <Button variant="outline" className="h-24 flex flex-col gap-2 border-primary ring-1 ring-primary bg-primary/5">
                        <div className="w-8 h-4 border-2 border-primary rounded-sm" />
                        <span>Landscape (16:9)</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col gap-2">
                        <div className="w-4 h-8 border-2 border-current rounded-sm" />
                        <span>Portrait (9:16)</span>
                      </Button>
                      <Button variant="outline" className="h-24 flex flex-col gap-2">
                        <div className="flex gap-1"><div className="w-4 h-3 border-2 border-current rounded-sm" /><div className="w-2 h-4 border-2 border-current rounded-sm" /></div>
                        <span>Both Formats</span>
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-4">
                      <input type="checkbox" id="subs" defaultChecked className="w-4 h-4 rounded border-border bg-background text-primary focus:ring-primary" />
                      <Label htmlFor="subs">Burn-in subtitles automatically</Label>
                    </div>
                  </div>
                )}
                
              </CardContent>
              <CardFooter className="bg-muted/30 pt-6">
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={startRender.isPending || renderStatus?.status === 'rendering'}
                  onClick={() => startRender.mutate({ projectId, data: { format: 'landscape', includeSubtitles: true } })}
                >
                  <Play className="w-4 h-4 mr-2" /> Start Render
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="publish" className="m-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Download className="w-5 h-5 text-primary" /> Download Assets</CardTitle>
                  <CardDescription>Get your files for manual upload or archiving.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-between" disabled={!publishInfo?.downloadUrls.landscape}>
                    Final Video (MP4) <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" disabled={!publishInfo?.downloadUrls.srt}>
                    Subtitles (SRT) <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" disabled={!publishInfo?.downloadUrls.thumbnail}>
                    Thumbnail (JPG) <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between">
                    Project Data (JSON) <Download className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Youtube className="w-5 h-5 text-red-500" /> YouTube Direct</CardTitle>
                  <CardDescription>Publish directly to your connected channel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!publishInfo?.youtubeEnabled ? (
                    <div className="text-center p-6 bg-muted/50 rounded-lg">
                      <Settings2 className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                      <p className="text-sm text-muted-foreground mb-4">YouTube integration is not configured in settings.</p>
                      <Button variant="outline" size="sm" onClick={() => setLocation('/settings')}>Go to Settings</Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input defaultValue={project.title} className="bg-background" />
                      </div>
                      <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea defaultValue={project.description || ''} className="bg-background resize-none h-24" />
                      </div>
                      <Button 
                        className="w-full bg-red-600 hover:bg-red-700 text-white" 
                        disabled={publishYoutube.isPending}
                        onClick={() => publishYoutube.mutate({ projectId, data: { platform: 'youtube', title: project.title } }, {
                          onSuccess: () => toast.success('Published to YouTube!')
                        })}
                      >
                        <Youtube className="w-4 h-4 mr-2" /> Publish Now
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
