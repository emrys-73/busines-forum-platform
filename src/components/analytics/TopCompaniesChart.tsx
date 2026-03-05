'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface TopCompaniesChartProps {
  data: { name: string; members: number }[]
}

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981']

export function TopCompaniesChart({ data }: TopCompaniesChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, bottom: 40, left: 0 }}>
        <XAxis dataKey="name" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" interval={0} />
        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
        <Tooltip formatter={(v) => [`${v} Mitglieder`, 'Teamgröße']} />
        <Bar dataKey="members" radius={[4, 4, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
