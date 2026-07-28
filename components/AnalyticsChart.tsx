'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartDataPoint {
  name: string
  followers: number
  views: number
}

interface AnalyticsChartProps {
  data: ChartDataPoint[]
  mode: 'followers' | 'views'
}

const modeConfig = {
  followers: { color: '#dc2743', label: 'Follower' },
  views: { color: '#8b5cf6', label: 'Visualizzazioni' },
}

export default function AnalyticsChart({ data, mode }: AnalyticsChartProps) {
  const { color, label } = modeConfig[mode]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.25} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="name"
          stroke="transparent"
          tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          stroke="transparent"
          tick={{ fill: 'rgba(156,163,175,0.7)', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(9,9,15,0.96)',
            border: `1px solid ${color}40`,
            borderRadius: '12px',
            color: '#fff',
            fontSize: '12px',
            padding: '10px 14px',
          }}
          formatter={(value: number) => [
            value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value,
            label,
          ]}
          labelStyle={{ color: 'rgba(156,163,175,0.8)', marginBottom: '4px', fontSize: '11px' }}
          cursor={{ stroke: `${color}30`, strokeWidth: 1 }}
        />
        <Area
          type="monotone"
          dataKey={mode}
          stroke={color}
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#chartGrad)"
          dot={false}
          activeDot={{ r: 4, fill: color, strokeWidth: 2, stroke: '#09090f' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
