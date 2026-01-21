'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui';
import { ExternalLink, Github, Book, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const resources = [
  {
    title: 'Documentation',
    description: 'Learn how to use STX DeFi Protocol',
    icon: Book,
    href: 'https://docs.stxdefi.io',
    external: true,
  },
  {
    title: 'GitHub',
    description: 'View source code and contribute',
    icon: Github,
    href: 'https://github.com/phessophissy/stx-defi',
    external: true,
  },
  {
    title: 'Discord',
    description: 'Join our community for support',
    icon: MessageCircle,
    href: 'https://discord.gg/stacks',
    external: true,
  },
];

const quickLinks = [
  { label: 'Deposit STX', href: '/lend', description: 'Start earning with your STX' },
  { label: 'Yield Vault', href: '/vault', description: 'Earn 8% APY passively' },
  { label: 'View Positions', href: '/positions', description: 'Manage your positions' },
  { label: 'Analytics', href: '/analytics', description: 'Protocol statistics' },
  { label: 'FAQ', href: '/faq', description: 'Common questions answered' },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Book className="w-8 h-8 text-[var(--primary)]" />
          Resources
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Documentation, community, and helpful links
        </p>
      </div>

      {/* External Resources */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <a
              key={resource.title}
              href={resource.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full hover:border-[var(--primary)] transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-[var(--primary)]/10 rounded-lg mb-4">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                    </div>
                    <ExternalLink className="w-4 h-4 text-[var(--muted-foreground)] group-hover:text-[var(--primary)]" />
                  </div>
                  <h3 className="font-semibold mb-1">{resource.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            </a>
          );
        })}
      </div>

      {/* Quick Links */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Links</CardTitle>
          <CardDescription>Navigate the protocol</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--secondary)] transition-colors"
              >
                <h4 className="font-medium mb-1">{link.label}</h4>
                <p className="text-sm text-[var(--muted-foreground)]">{link.description}</p>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Protocol Info */}
      <Card>
        <CardHeader>
          <CardTitle>Protocol Parameters</CardTitle>
          <CardDescription>Current protocol configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Collateral Ratio', value: '150%' },
              { label: 'Liquidation Threshold', value: '120%' },
              { label: 'Borrow APY', value: '5.00%' },
              { label: 'Vault APY', value: '8.00%' },
              { label: 'Liquidation Bonus', value: '0.50%' },
              { label: 'Min Deposit', value: '0.001 STX' },
              { label: 'Network', value: 'Stacks' },
              { label: 'Status', value: 'Active' },
            ].map((param) => (
              <div
                key={param.label}
                className="p-3 bg-[var(--secondary)] rounded-lg"
              >
                <p className="text-xs text-[var(--muted-foreground)]">{param.label}</p>
                <p className="font-semibold">{param.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
