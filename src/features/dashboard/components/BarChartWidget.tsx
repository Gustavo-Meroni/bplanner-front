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
    <div className="bg-card p-6 rounded-[2rem] shadow-sm border border-border h-full flex flex-col min-h-[400px]">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-6 flex-shrink-0">
        Aportes Mensais
      </h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              tickFormatter={(val) => `R$${val}`}
              width={60}
            />
            <Tooltip
              cursor={{ fill: 'hsl(240 5% 96% / 0.8)' }}
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid hsl(240 5% 85%)',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
              }}
              formatter={(value: any) => [formatCurrency(Number(value || 0)), 'Valor']}
            />
            <ReferenceLine
              y={metaViagem}
              stroke="#22D3EE"
              strokeDasharray="3 3"
              label={{ position: 'top', value: 'Meta', fill: '#22D3EE', fontSize: 11 }}
            />
            <Bar dataKey="acumulado" fill="#22D3EE" radius={[4, 4, 0, 0]} maxBarSize={40} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
