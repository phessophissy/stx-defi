import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)] mb-4" />
      <p className="text-[var(--muted-foreground)]">Loading...</p>
    </div>
  );
}
