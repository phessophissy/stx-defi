'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-[var(--destructive)]/10 rounded-full">
            <AlertTriangle className="w-12 h-12 text-[var(--destructive)]" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-4">Something went wrong!</h1>
        <p className="text-[var(--muted-foreground)] mb-6">
          An unexpected error occurred. This might be a temporary issue.
          Please try again or contact support if the problem persists.
        </p>
        {error.digest && (
          <p className="text-xs text-[var(--muted-foreground)] mb-4">
            Error ID: {error.digest}
          </p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
