import React from 'react';
import { 
  LineChart, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import { TrendData, SalesData, AudienceData } from '../types';

// Vibrant, clean colors for white background
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'];

interface TrendChartProps {
  data: TrendData[];
  dataKey: keyof TrendData;
  color: string;
  label: string;
}

export const TrendLineChart: React.FC<TrendChartProps> = ({ data, dataKey, color, label }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id={`color${dataKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
            <stop offset="95%" stopColor={color} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="date" stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} dy={10} />
        <YAxis stroke="#64748b" tick={{fontSize: 12}} tickLine={false} axisLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', color: '#1e293b', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          itemStyle={{ color: '#334155', fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }}/>
        <Area 
          type="monotone" 
          dataKey={dataKey} 
          name={label}
          stroke={color} 
          strokeWidth={3}
          fillOpacity={1} 
          fill={`url(#color${dataKey})`} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

interface CategorySalesProps {
  data: SalesData[];
}

export const CategorySalesPie: React.FC<CategorySalesProps> = ({ data }) => {
  const aggregated = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.revenue;
    } else {
      acc.push({ name: curr.category, value: curr.revenue });
    }
    return acc;
  }, [] as {name: string, value: number}[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={aggregated}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {aggregated.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
           formatter={(value: number) => `¥${value.toLocaleString()}`}
           itemStyle={{ color: '#334155' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const DistributionPie: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
           contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
           itemStyle={{ color: '#334155' }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export const PlatformComparisonBar: React.FC<{ data: SalesData[] }> = ({ data }) => {
   const aggregated = data.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.platform);
    if (existing) {
      existing.revenue += curr.revenue;
      existing.units += curr.units;
    } else {
      acc.push({ name: curr.platform, revenue: curr.revenue, units: curr.units });
    }
    return acc;
  }, [] as {name: string, revenue: number, units: number}[]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={aggregated} barGap={0}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="name" stroke="#64748b" tickLine={false} axisLine={false} dy={5} />
        <YAxis stroke="#64748b" tickLine={false} axisLine={false} />
        <Tooltip 
          cursor={{fill: '#f1f5f9'}}
          contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
          itemStyle={{ color: '#334155' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }}/>
        <Bar dataKey="revenue" name="销售额 (元)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
        <Bar dataKey="units" name="销量 (件)" fill="#10b981" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const AudienceRadar: React.FC<{ data: AudienceData }> = ({ data }) => {
  const radarData = [
    { subject: '消费力', A: 80, fullMark: 100 },
    { subject: '互动率', A: 65, fullMark: 100 },
    { subject: '复购率', A: 45, fullMark: 100 },
    { subject: '新事物敏感', A: 90, fullMark: 100 },
    { subject: '价格敏感', A: 50, fullMark: 100 },
    { subject: '传播意愿', A: 70, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
        <PolarGrid stroke="#e2e8f0" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Audience Profile"
          dataKey="A"
          stroke="#8b5cf6"
          strokeWidth={3}
          fill="#8b5cf6"
          fillOpacity={0.2}
        />
        <Tooltip contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px' }}/>
      </RadarChart>
    </ResponsiveContainer>
  );
};