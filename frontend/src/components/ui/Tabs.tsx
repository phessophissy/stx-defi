'use client';

import clsx from 'clsx';

interface TabsProps {
  tabs: { id: string; label: string; icon?: React.ReactNode }[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export default function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
  className,
}: TabsProps) {
  return (
    <div
      className={clsx(
        'flex',
        variant === 'default' && 'border-b border-[var(--border)]',
        variant === 'pills' && 'bg-[var(--secondary)] rounded-lg p-1 gap-1',
        variant === 'underline' && 'gap-4',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 font-medium transition-colors',
              // Default variant
              variant === 'default' && [
                'px-4 py-2 -mb-px border-b-2',
                isActive
                  ? 'border-[var(--primary)] text-[var(--primary)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:border-[var(--border)]',
              ],
              // Pills variant
              variant === 'pills' && [
                'px-4 py-2 rounded-md flex-1 justify-center',
                isActive
                  ? 'bg-[var(--background)] text-[var(--foreground)] shadow-sm'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              ],
              // Underline variant
              variant === 'underline' && [
                'pb-2 border-b-2',
                isActive
                  ? 'border-[var(--primary)] text-[var(--foreground)]'
                  : 'border-transparent text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
              ]
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

interface TabPanelProps {
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ children, className }: TabPanelProps) {
  return <div className={clsx('pt-4', className)}>{children}</div>;
}
