import { useGetSettings, useUpdateSettings } from '@workspace/api-client-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { InfoIcon, KeyIcon, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { useEffect } from 'react';

const settingsSchema = z.object({
  openaiApiKey: z.string().optional(),
  pexelsApiKey: z.string().optional(),
  youtubeClientId: z.string().optional(),
  youtubeClientSecret: z.string().optional(),
  defaultVoice: z.string(),
  defaultFormat: z.enum(['landscape', 'portrait', 'both'])
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

export default function SettingsPage() {
  const { data: settings, isLoading } = useGetSettings();
  const updateSettings = useUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      openaiApiKey: '',
      pexelsApiKey: '',
      youtubeClientId: '',
      youtubeClientSecret: '',
      defaultVoice: 'alloy',
      defaultFormat: 'portrait'
    }
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        openaiApiKey: settings.openaiApiKey || '',
        pexelsApiKey: settings.pexelsApiKey || '',
        youtubeClientId: settings.youtubeClientId || '',
        youtubeClientSecret: settings.youtubeClientSecret || '',
        defaultVoice: settings.defaultVoice || 'alloy',
        defaultFormat: settings.defaultFormat || 'portrait'
      });
    }
  }, [settings, form]);

  const onSubmit = (data: SettingsFormValues) => {
    updateSettings.mutate({ data }, {
      onSuccess: () => {
        toast.success("Settings saved successfully");
      },
      onError: (error) => {
        toast.error("Failed to save settings: " + (error as Error).message);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Settings</h1>
        <p className="text-muted-foreground mt-1">Configure your API keys and default preferences.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyIcon className="w-5 h-5 text-primary" />
                API Configuration
              </CardTitle>
              <CardDescription>
                Provide your API keys to enable full functionality. Keys are stored securely.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <FormField
                control={form.control}
                name="openaiApiKey"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>OpenAI API Key</FormLabel>
                      {settings?.openaiKeySet && <Badge variant="success">Set</Badge>}
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={settings?.openaiKeySet ? "••••••••••••••••" : "sk-..."} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Required for script generation, originality checking, and TTS.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pexelsApiKey"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Pexels API Key</FormLabel>
                      {settings?.pexelsKeySet && <Badge variant="success">Set</Badge>}
                    </div>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder={settings?.pexelsKeySet ? "••••••••••••••••" : "563492ad6f91700001000001..."} 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>Required for searching and downloading stock media.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {!settings?.openaiKeySet && (
                <Alert className="bg-primary/5 border-primary/20 text-primary-foreground">
                  <InfoIcon className="h-4 w-4 text-primary" />
                  <AlertTitle>Missing OpenAI Key</AlertTitle>
                  <AlertDescription className="text-muted-foreground text-sm">
                    Without an OpenAI key, the app will use mock data for generation features.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>YouTube Integration</CardTitle>
              <CardDescription>
                Configure YouTube OAuth to publish directly from VideoForge.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="youtubeClientId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client ID</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={settings?.youtubeConfigured ? "••••••••••••••••" : "Client ID"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="youtubeClientSecret"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>Client Secret</FormLabel>
                        {settings?.youtubeConfigured && <Badge variant="success">Configured</Badge>}
                      </div>
                      <FormControl>
                        <Input type="password" placeholder={settings?.youtubeConfigured ? "••••••••••••••••" : "Client Secret"} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Project Defaults</CardTitle>
              <CardDescription>
                Set your default preferences for new projects.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="defaultVoice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Voice</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a voice" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alloy">Alloy (Neutral)</SelectItem>
                          <SelectItem value="echo">Echo (Warm)</SelectItem>
                          <SelectItem value="fable">Fable (Expressive)</SelectItem>
                          <SelectItem value="onyx">Onyx (Deep)</SelectItem>
                          <SelectItem value="nova">Nova (Energetic)</SelectItem>
                          <SelectItem value="shimmer">Shimmer (Clear)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="defaultFormat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Output Format</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="landscape">Landscape (16:9)</SelectItem>
                          <SelectItem value="portrait">Portrait (9:16)</SelectItem>
                          <SelectItem value="both">Both</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </div>
        </form>
      </Form>
      
    </div>
  );
}

function Badge({ children, variant }: { children: React.ReactNode, variant?: string }) {
  if (variant === 'success') {
    return <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20"><CheckCircle2 className="w-3 h-3"/> {children}</span>
  }
  return <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600 ring-1 ring-inset ring-zinc-500/10">{children}</span>
}
