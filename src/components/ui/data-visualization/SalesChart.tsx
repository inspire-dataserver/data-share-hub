
import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface SalesChartProps {
  data: {
    name: string;
    total: number;
  }[];
}

const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RechartsBarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
        <XAxis 
          dataKey="name" 
          tick={{ fill: '#888888' }}
          axisLine={{ stroke: '#e5e5e5' }}
        />
        <YAxis 
          tick={{ fill: '#888888' }}
          axisLine={{ stroke: '#e5e5e5' }}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value) => [`$${value}`, 'Revenue']}
          labelFormatter={(label) => `Month: ${label}`}
          contentStyle={{ 
            backgroundColor: 'white', 
            border: '1px solid #e5e5e5',
            borderRadius: '4px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Legend />
        <Bar 
          dataKey="total" 
          fill="#8884d8" 
          name="Monthly Revenue"
          radius={[4, 4, 0, 0]}
          barSize={30}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
