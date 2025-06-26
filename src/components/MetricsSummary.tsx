import type { WeeklyMetrics } from '../types/github';

interface MetricsSummaryProps {
  weeklyMetrics: WeeklyMetrics[];
}

const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${Math.round(minutes)} minutes`;
  }
  const hours = Math.round(minutes / 60 * 10) / 10;
  return `${hours} hours`;
};

export const MetricsSummary = ({ weeklyMetrics }: MetricsSummaryProps) => {
  if (weeklyMetrics.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-6 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const totalPRs = weeklyMetrics.reduce((sum, week) => sum + week.totalPRs, 0);
  
  const avgRequestToReview = weeklyMetrics.length > 0
    ? weeklyMetrics.reduce((sum, week) => sum + week.avgRequestToReviewTime, 0) / weeklyMetrics.length
    : 0;
    
  const avgReviewToMerge = weeklyMetrics.length > 0
    ? weeklyMetrics.reduce((sum, week) => sum + week.avgReviewToMergeTime, 0) / weeklyMetrics.length
    : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Total PRs</h3>
        <p className="text-2xl font-bold text-blue-900">{totalPRs}</p>
        <p className="text-sm text-blue-600">Merged pull requests</p>
      </div>
      
      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Avg Request to Review</h3>
        <p className="text-2xl font-bold text-purple-900">{formatTime(avgRequestToReview)}</p>
        <p className="text-sm text-purple-600">Time until first review</p>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Avg Review to Merge</h3>
        <p className="text-2xl font-bold text-green-900">{formatTime(avgReviewToMerge)}</p>
        <p className="text-sm text-green-600">Time from review to merge</p>
      </div>
    </div>
  );
};