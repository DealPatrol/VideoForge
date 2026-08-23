import { Badge } from '@/components/ui/badge';
import { ProjectStatus } from '@workspace/api-client-react';

export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    draft: { label: 'Draft', className: 'bg-zinc-800 text-zinc-300 border-zinc-700' },
    analyzing: { label: 'Analyzing', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse' },
    concepts: { label: 'Concepts', className: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
    scripting: { label: 'Scripting', className: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
    media: { label: 'Media', className: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
    voiceover: { label: 'Voiceover', className: 'bg-teal-500/10 text-teal-500 border-teal-500/20' },
    rendering: { label: 'Rendering', className: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 animate-pulse' },
    ready: { label: 'Ready', className: 'bg-green-500/10 text-green-500 border-green-500/20' },
    published: { label: 'Published', className: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  };

  const config = map[status] || map.draft;

  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
}
