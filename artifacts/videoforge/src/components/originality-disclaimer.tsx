import { AlertTriangle } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function OriginalityDisclaimer() {
  return (
    <Alert className="bg-primary/5 border-primary/20 text-primary-foreground mb-6">
      <AlertTriangle className="h-4 w-4 text-primary" />
      <AlertTitle className="text-primary font-semibold tracking-tight">Original Creation Only</AlertTitle>
      <AlertDescription className="text-muted-foreground mt-1">
        VideoForge helps you create ORIGINAL content inspired by trends — never copy scripts, footage, music, or creator voices. This tool is for trend-informed original creation only.
      </AlertDescription>
    </Alert>
  );
}
