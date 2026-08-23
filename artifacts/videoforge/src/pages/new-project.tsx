import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAnalyzeReference, useCreateProject, useGenerateConcepts, useSelectConcept } from '@workspace/api-client-react';
import type { AnalysisResult, Concept } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { OriginalityDisclaimer } from '@/components/originality-disclaimer';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Youtube, Search, ArrowRight, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function NewProjectPage() {
  const [, setLocation] = useLocation();
  const createProject = useCreateProject();
  const analyzeRef = useAnalyzeReference();
  const generateConcepts = useGenerateConcepts();
  const selectConcept = useSelectConcept();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sourceType, setSourceType] = useState<'url' | 'topic'>('url');
  const [referenceUrl, setReferenceUrl] = useState('');
  const [referenceTopic, setReferenceTopic] = useState('');

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [createdProjectId, setCreatedProjectId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [concepts, setConcepts] = useState<Concept[]>([]);

  const handleStartAnalysis = async () => {
    if (!title.trim()) {
      toast.error('Please enter a project title');
      return;
    }
    if (sourceType === 'url' && !referenceUrl.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }
    if (sourceType === 'topic' && !referenceTopic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    try {
      const project = await createProject.mutateAsync({
        data: {
          title,
          description,
          referenceUrl: sourceType === 'url' ? referenceUrl : undefined,
          referenceTopic: sourceType === 'topic' ? referenceTopic : undefined
        }
      });
      
      setCreatedProjectId(project.id);
      setStep(2);

      const analysis = await analyzeRef.mutateAsync({
        data: {
          projectId: project.id,
          url: sourceType === 'url' ? referenceUrl : undefined,
          topic: sourceType === 'topic' ? referenceTopic : undefined
        }
      });
      
      setAnalysisResult(analysis);
      setStep(3);
    } catch (error) {
      toast.error('Failed to create project or start analysis');
      setStep(1);
    }
  };

  const handleGenerateConcepts = async () => {
    if (!createdProjectId || !analysisResult) return;
    try {
      setStep(4);
      const generated = await generateConcepts.mutateAsync({
        projectId: createdProjectId,
        data: { analysisResult }
      });
      setConcepts(generated);
      setStep(5);
    } catch (error) {
      toast.error('Failed to generate concepts');
      setStep(3);
    }
  };

  const handleSelectConcept = async (conceptId: string) => {
    if (!createdProjectId) return;
    try {
      await selectConcept.mutateAsync({ projectId: createdProjectId, conceptId });
      toast.success('Concept selected. Generating script setup...');
      setLocation(`/projects/${createdProjectId}?tab=script`);
    } catch (error) {
      toast.error('Failed to select concept');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <OriginalityDisclaimer />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">New Project</h1>
        <p className="text-muted-foreground mt-1">Start from a trend, a competitor's video, or a raw idea.</p>
      </div>

      {step === 1 && (
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>Name your project and provide a source for trend analysis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input 
                id="title" 
                placeholder="e.g., The Future of AI Coding" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-background"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="desc">Internal Description (Optional)</Label>
              <Textarea 
                id="desc" 
                placeholder="What's the goal of this video?" 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-background resize-none"
                rows={2}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-border/50">
              <Label>Source Material</Label>
              <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as 'url'|'topic')} className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <Youtube className="w-4 h-4" /> YouTube URL
                  </TabsTrigger>
                  <TabsTrigger value="topic" className="flex items-center gap-2">
                    <Search className="w-4 h-4" /> Trend / Topic
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="pt-4 space-y-2">
                  <Input 
                    placeholder="https://youtube.com/watch?v=..." 
                    value={referenceUrl}
                    onChange={(e) => setReferenceUrl(e.target.value)}
                    className="bg-background max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    VideoForge will analyze this video's pacing, hook structure, and retention mechanics to help you build an original script.
                  </p>
                </TabsContent>
                <TabsContent value="topic" className="pt-4 space-y-2">
                  <Input 
                    placeholder="e.g., Productivity hacks for ADHD" 
                    value={referenceTopic}
                    onChange={(e) => setReferenceTopic(e.target.value)}
                    className="bg-background max-w-md"
                  />
                  <p className="text-xs text-muted-foreground">
                    VideoForge will analyze current YouTube trends around this topic to suggest proven formats.
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button 
              size="lg" 
              onClick={handleStartAnalysis}
              disabled={createProject.isPending || analyzeRef.isPending}
              className="gap-2"
            >
              {(createProject.isPending || analyzeRef.isPending) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Analyze Source
            </Button>
          </CardFooter>
        </Card>
      )}

      {(step === 2 || step === 4) && (
        <Card className="bg-card/50 border-border/50 border-primary/20">
          <CardContent className="py-16 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="w-16 h-16 bg-card border border-primary/30 rounded-2xl flex items-center justify-center relative z-10">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2 max-w-md">
              <h3 className="text-xl font-medium tracking-tight">
                {step === 2 ? `Analyzing "${title}"` : 'Generating Concepts'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {step === 2 ? 'Extracting hook patterns, pacing metrics, and story structures.' : 'Creating unique angles and hooks based on the analysis data.'}
              </p>
            </div>
            
            <div className="w-full max-w-xs space-y-2">
              <div className="h-1 w-full bg-border rounded-full overflow-hidden">
                <div className="h-full bg-primary w-1/2 animate-[progress_2s_ease-in-out_infinite]" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && analysisResult && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <CheckCircle2 className="w-5 h-5" />
            <h2 className="text-xl font-semibold text-foreground">Analysis Complete</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card className="bg-card/50">
              <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Hook Type</CardTitle></CardHeader>
              <CardContent><p className="font-medium">{analysisResult.hookType}</p></CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Pacing</CardTitle></CardHeader>
              <CardContent><p className="font-medium">{analysisResult.pacing}</p></CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Story Structure</CardTitle></CardHeader>
              <CardContent><p className="font-medium">{analysisResult.storyStructure}</p></CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Caption Density</CardTitle></CardHeader>
              <CardContent><p className="font-medium">{analysisResult.captionDensity}</p></CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">CTA Timing</CardTitle></CardHeader>
              <CardContent><p className="font-medium">{analysisResult.ctaTiming}</p></CardContent>
            </Card>
            <Card className="bg-card/50">
              <CardHeader className="py-4"><CardTitle className="text-sm text-muted-foreground">Audience Angle</CardTitle></CardHeader>
              <CardContent><p className="font-medium">{analysisResult.audienceAngle}</p></CardContent>
            </Card>
          </div>

          <div className="flex justify-end mt-8">
            <Button size="lg" onClick={handleGenerateConcepts} className="gap-2">
              Generate Concepts <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 5 && concepts && concepts.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Select a Concept</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {concepts.map(concept => (
              <Card key={concept.id} className="bg-card/50 border-border/50 flex flex-col hover:border-primary/50 transition-colors">
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
                    disabled={selectConcept.isPending}
                    onClick={() => handleSelectConcept(concept.id)}
                  >
                    Select Concept
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
