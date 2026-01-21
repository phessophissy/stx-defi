import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Not Found - STX DeFi Protocol',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[var(--primary)] mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-[var(--muted-foreground)] mb-8 max-w-md">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/"
            className="px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-opacity"
          >
            Go Home
          </a>
          <a
            href="/faq"
            className="px-6 py-2 border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            View FAQ
          </a>
        </div>
      </div>
    </div>
  );
}
