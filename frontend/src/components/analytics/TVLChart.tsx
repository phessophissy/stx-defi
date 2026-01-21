'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { formatSTX } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';

interface TVLChartProps {
  data?: { date: string; tvl: number }[];
  className?: string;
}

// Mock historical TVL data
const mockTVLData = [
  { date: '2024-01-01', tvl: 50000000000 },
  { date: '2024-01-02', tvl: 52000000000 },
  { date: '2024-01-03', tvl: 51500000000 },
  { date: '2024-01-04', tvl: 54000000000 },
  { date: '2024-01-05', tvl: 58000000000 },
  { date: '2024-01-06', tvl: 62000000000 },
  { date: '2024-01-07', tvl: 65000000000 },
];

export default function TVLChart({ data = mockTVLData, className }: TVLChartProps) {
  const maxTVL = Math.max(...data.map((d) => d.tvl));
  const minTVL = Math.min(...data.map((d) => d.tvl));
  const range = maxTVL - minTVL || 1;
  const currentTVL = data[data.length - 1]?.tvl || 0;
  const previousTVL = data[data.length - 2]?.tvl || currentTVL;
  const change = previousTVL > 0 ? ((currentTVL - previousTVL) / previousTVL) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Total Value Locked
          </CardTitle>
          <div className="text-right">
            <p className="text-2xl font-bold">{formatSTX(currentTVL)} STX</p>
            <p
              className={`text-sm ${change >= 0 ? 'text-[var(--success)]' : 'text-[var(--destructive)]'}`}
            >
              {change >= 0 ? '+' : ''}
              {change.toFixed(2)}% today
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Simple bar chart visualization */}
        <div className="flex items-end justify-between h-40 gap-2 pt-4">
          {data.map((point, index) => {
            const height = ((point.tvl - minTVL) / range) * 100;
            const isLast = index === data.length - 1;
            return (
              <div key={point.date} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    isLast ? 'bg-[var(--primary)]' : 'bg-[var(--primary)]/50'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                  title={`${point.date}: ${formatSTX(point.tvl)} STX`}
                />
                <span className="text-[10px] text-[var(--muted-foreground)]">
                  {new Date(point.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t border-[var(--border)]">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">7d Low</p>
            <p className="font-semibold">{formatSTX(minTVL)} STX</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[var(--muted-foreground)]">7d High</p>
            <p className="font-semibold">{formatSTX(maxTVL)} STX</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
