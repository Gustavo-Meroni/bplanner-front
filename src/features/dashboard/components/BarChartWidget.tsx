'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { formatCurrency } from '@/shared/utils/format-currency';
import type { AporteChartPoint } from '../api/types';

interface BarChartWidgetProps {
  metaViagem: number;
  data: AporteChartPoint[];
}

export function BarChartWidget({ metaViagem, data }: BarChartWidgetProps) {
  return (
    <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border/50 h-full flex flex-col min-h-[400px]">
      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6 flex-shrink-0">
        Aportes Mensais
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              tickFormatter={(val) => `R$${val}`}
              width={60}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted) / 0.5)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderRadius: '12px',
                border: '1px solid hsl(var(--border))',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Valor']}
            />
            <ReferenceLine
              y={metaViagem}
              stroke="hsl(var(--primary))"
              strokeDasharray="3 3"
              label={{ position: 'top', value: 'Meta', fill: 'hsl(var(--primary))', fontSize: 11, fontWeight: 'bold' }}
            />
            <Bar dataKey="acumulado" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}