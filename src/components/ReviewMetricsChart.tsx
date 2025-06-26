import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format } from 'date-fns';
import type { WeeklyMetrics } from '../types/github';

interface ReviewMetricsChartProps {
  data: WeeklyMetrics[];
  chartType?: 'line' | 'bar';
}

const formatMinutesToHours = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const hours = Math.round(minutes / 60 * 10) / 10;
  return `${hours}h`;
};

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
        <p className="font-semibold">{`Week of ${format(new Date(label!), 'MMM dd, yyyy')}`}</p>
        {payload.map((entry: TooltipEntry, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${formatMinutesToHours(entry.value)}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ReviewMetricsChart = ({ data, chartType = 'line' }: ReviewMetricsChartProps) => {
  const chartData = data.map(week => ({
    ...week,
    weekLabel: format(week.weekStartDate, 'MMM dd'),
    requestToReviewHours: Math.round(week.avgRequestToReviewTime / 60 * 10) / 10,
    reviewToMergeHours: Math.round(week.avgReviewToMergeTime / 60 * 10) / 10,
  }));

  if (chartType === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="weekLabel" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar 
            dataKey="requestToReviewHours" 
            fill="#8884d8" 
            name="Request to Review Time"
            radius={[2, 2, 0, 0]}
          />
          <Bar 
            dataKey="reviewToMergeHours" 
            fill="#82ca9d" 
            name="Review to Merge Time"
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="weekLabel" 
          tick={{ fontSize: 12 }}
        />
        <YAxis 
          label={{ value: 'Hours', angle: -90, position: 'insideLeft' }}
          tick={{ fontSize: 12 }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="requestToReviewHours" 
          stroke="#8884d8" 
          strokeWidth={3}
          name="Request to Review Time"
          dot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="reviewToMergeHours" 
          stroke="#82ca9d" 
          strokeWidth={3}
          name="Review to Merge Time"
          dot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};