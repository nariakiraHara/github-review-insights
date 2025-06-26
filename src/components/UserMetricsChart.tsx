import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format } from 'date-fns';
import type { WeeklyUserMetrics, ReviewerMetrics, RevieweeMetrics } from '../types/github';

interface UserMetricsChartProps {
  data: WeeklyUserMetrics[];
  metricType: 'reviewer' | 'reviewee';
  chartType?: 'bar' | 'pie';
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00',
  '#ff00ff', '#00ffff', '#ff0000', '#0000ff', '#ffff00'
];


interface TooltipEntry {
  color: string;
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold">{label}</p>
        {payload.map((entry: TooltipEntry, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const UserMetricsChart = ({ data, metricType, chartType = 'bar' }: UserMetricsChartProps) => {
  if (data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No data available
      </div>
    );
  }

  if (chartType === 'pie') {
    // Aggregate data for pie chart
    const aggregatedData = new Map<string, number>();
    
    data.forEach(week => {
      const metrics = metricType === 'reviewer' ? week.reviewerMetrics : week.revieweeMetrics;
      metrics.forEach(metric => {
        const name = metricType === 'reviewer' 
          ? (metric as ReviewerMetrics).reviewerName 
          : (metric as RevieweeMetrics).revieweeName;
        const count = metricType === 'reviewer' 
          ? (metric as ReviewerMetrics).reviewCount 
          : (metric as RevieweeMetrics).prCount;
        
        aggregatedData.set(name, (aggregatedData.get(name) || 0) + count);
      });
    });

    const pieData = Array.from(aggregatedData.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Top 10

    return (
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value }) => `${name}: ${value}`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  }

  // Bar chart - show weekly data
  const chartData = data.map(week => {
    const weekLabel = format(week.weekStartDate, 'MMM dd');
    const result: Record<string, string | number> = { weekLabel };

    if (metricType === 'reviewer') {
      week.reviewerMetrics.forEach((metric, index) => {
        if (index < 5) { // Show top 5 reviewers
          result[metric.reviewerName] = metric.reviewCount;
        }
      });
    } else {
      week.revieweeMetrics.forEach((metric, index) => {
        if (index < 5) { // Show top 5 reviewees
          result[metric.revieweeName] = metric.prCount;
        }
      });
    }

    return result;
  });

  // Get all unique user names for bars
  const allUsers = new Set<string>();
  data.forEach(week => {
    const metrics = metricType === 'reviewer' ? week.reviewerMetrics : week.revieweeMetrics;
    metrics.slice(0, 5).forEach(metric => {
      const name = metricType === 'reviewer' 
        ? (metric as ReviewerMetrics).reviewerName 
        : (metric as RevieweeMetrics).revieweeName;
      allUsers.add(name);
    });
  });

  const userArray = Array.from(allUsers);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="weekLabel" tick={{ fontSize: 12 }} />
        <YAxis 
          label={{ 
            value: metricType === 'reviewer' ? 'Reviews' : 'PRs', 
            angle: -90, 
            position: 'insideLeft' 
          }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {userArray.map((user, index) => (
          <Bar 
            key={user}
            dataKey={user} 
            fill={COLORS[index % COLORS.length]}
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};