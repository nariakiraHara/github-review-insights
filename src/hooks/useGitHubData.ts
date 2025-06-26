import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { differenceInMinutes, startOfWeek, parseISO, subMonths, formatISO } from 'date-fns';
import { GET_PULL_REQUESTS } from '../lib/github-queries';
import type { PullRequest, ReviewMetrics, WeeklyMetrics, WeeklyUserMetrics, ReviewerMetrics, RevieweeMetrics } from '../types/github';

interface UseGitHubDataProps {
  owner: string;
  repo: string;
}

interface UseGitHubDataFilters {
  selectedReviewee?: string;
  selectedReviewer?: string;
}

export const useGitHubData = ({ owner, repo }: UseGitHubDataProps) => {
  const [metrics, setMetrics] = useState<ReviewMetrics[]>([]);
  const [weeklyMetrics, setWeeklyMetrics] = useState<WeeklyMetrics[]>([]);
  const [weeklyUserMetrics, setWeeklyUserMetrics] = useState<WeeklyUserMetrics[]>([]);
  const [allReviewees, setAllReviewees] = useState<string[]>([]);
  const [allReviewers, setAllReviewers] = useState<string[]>([]);
  const [filters, setFilters] = useState<UseGitHubDataFilters>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [dataSize, setDataSize] = useState(0);

  // Calculate date for 1 month ago
  const oneMonthAgo = useMemo(() => {
    const date = subMonths(new Date(), 1);
    return formatISO(date, { representation: 'date' });
  }, []);

  const { data, loading, error } = useQuery(GET_PULL_REQUESTS, {
    variables: { 
      owner, 
      name: repo, 
      first: 100 // Can increase since we're limiting by date client-side
    },
    skip: !owner || !repo,
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (!data?.repository?.pullRequests?.nodes) return;

    const allPrs: PullRequest[] = data.repository.pullRequests.nodes;
    
    // Filter PRs to only include those from the last month
    const oneMonthAgoDate = parseISO(oneMonthAgo);
    const recentPrs = allPrs.filter(pr => {
      const createdAt = parseISO(pr.createdAt);
      return createdAt >= oneMonthAgoDate;
    });
    
    setDataSize(recentPrs.length);
    
    // Show warning for large datasets
    if (recentPrs.length > 150) {
      console.warn(`Large dataset detected: ${recentPrs.length} PRs. This may cause performance issues.`);
    }
    
    setIsProcessing(true);
    
    // Use setTimeout to prevent blocking the UI
    setTimeout(() => {
      try {
        const calculatedMetrics: ReviewMetrics[] = [];

    recentPrs.forEach((pr) => {
      if (!pr.mergedAt) return;

      const createdAt = parseISO(pr.createdAt);
      const mergedAt = parseISO(pr.mergedAt);
      
      // Find first review
      const firstReview = pr.reviews?.nodes
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .find(review => review.state === 'APPROVED' || review.state === 'CHANGES_REQUESTED');

      let requestToReviewTime: number | null = null;
      let reviewToMergeTime: number | null = null;

      if (firstReview) {
        const firstReviewAt = parseISO(firstReview.createdAt);
        requestToReviewTime = differenceInMinutes(firstReviewAt, createdAt);
        reviewToMergeTime = differenceInMinutes(mergedAt, firstReviewAt);
      }

      // Get unique reviewers from all reviews
      const reviewers = Array.from(new Set(
        pr.reviews.nodes
          .filter(review => review.author?.login && review.author.login !== pr.author?.login)
          .map(review => review.author.login)
      ));

      calculatedMetrics.push({
        prNumber: pr.number,
        title: pr.title,
        createdAt,
        mergedAt,
        requestToReviewTime,
        reviewToMergeTime,
        weekStartDate: startOfWeek(createdAt),
        reviewee: pr.author?.login || 'Unknown',
        reviewers,
      });
    });

    setMetrics(calculatedMetrics);

    // Calculate weekly aggregated metrics
    const weeklyData = new Map<string, {
      requestToReviewTimes: number[];
      reviewToMergeTimes: number[];
      totalPRs: number;
      weekStartDate: Date;
    }>();

    calculatedMetrics.forEach((metric) => {
      const weekKey = metric.weekStartDate.toISOString();
      
      if (!weeklyData.has(weekKey)) {
        weeklyData.set(weekKey, {
          requestToReviewTimes: [],
          reviewToMergeTimes: [],
          totalPRs: 0,
          weekStartDate: metric.weekStartDate,
        });
      }

      const weekData = weeklyData.get(weekKey)!;
      weekData.totalPRs++;
      
      if (metric.requestToReviewTime !== null) {
        weekData.requestToReviewTimes.push(metric.requestToReviewTime);
      }
      if (metric.reviewToMergeTime !== null) {
        weekData.reviewToMergeTimes.push(metric.reviewToMergeTime);
      }
    });

    const aggregatedWeeklyMetrics: WeeklyMetrics[] = Array.from(weeklyData.values())
      .map((weekData) => ({
        weekStartDate: weekData.weekStartDate,
        avgRequestToReviewTime: weekData.requestToReviewTimes.length > 0
          ? weekData.requestToReviewTimes.reduce((sum, time) => sum + time, 0) / weekData.requestToReviewTimes.length
          : 0,
        avgReviewToMergeTime: weekData.reviewToMergeTimes.length > 0
          ? weekData.reviewToMergeTimes.reduce((sum, time) => sum + time, 0) / weekData.reviewToMergeTimes.length
          : 0,
        totalPRs: weekData.totalPRs,
      }))
      .sort((a, b) => a.weekStartDate.getTime() - b.weekStartDate.getTime());

    setWeeklyMetrics(aggregatedWeeklyMetrics);

    // Extract unique reviewees and reviewers
    const reviewees = Array.from(new Set(calculatedMetrics.map(m => m.reviewee)));
    const reviewers = Array.from(new Set(calculatedMetrics.flatMap(m => m.reviewers)));
    setAllReviewees(reviewees);
    setAllReviewers(reviewers);

    // Calculate weekly user metrics
    const weeklyUserData = new Map<string, {
      reviewerCounts: Map<string, number>;
      reviewerTimes: Map<string, number[]>;
      revieweeCounts: Map<string, number>;
      revieweeRequestTimes: Map<string, number[]>;
      revieweeMergeTimes: Map<string, number[]>;
      weekStartDate: Date;
    }>();

    calculatedMetrics.forEach((metric) => {
      const weekKey = metric.weekStartDate.toISOString();
      
      if (!weeklyUserData.has(weekKey)) {
        weeklyUserData.set(weekKey, {
          reviewerCounts: new Map(),
          reviewerTimes: new Map(),
          revieweeCounts: new Map(),
          revieweeRequestTimes: new Map(),
          revieweeMergeTimes: new Map(),
          weekStartDate: metric.weekStartDate,
        });
      }

      const weekData = weeklyUserData.get(weekKey)!;
      
      // Count reviewee PRs
      const revieweeCount = weekData.revieweeCounts.get(metric.reviewee) || 0;
      weekData.revieweeCounts.set(metric.reviewee, revieweeCount + 1);
      
      // Track reviewee times
      if (metric.requestToReviewTime !== null) {
        const times = weekData.revieweeRequestTimes.get(metric.reviewee) || [];
        times.push(metric.requestToReviewTime);
        weekData.revieweeRequestTimes.set(metric.reviewee, times);
      }
      
      if (metric.reviewToMergeTime !== null) {
        const times = weekData.revieweeMergeTimes.get(metric.reviewee) || [];
        times.push(metric.reviewToMergeTime);
        weekData.revieweeMergeTimes.set(metric.reviewee, times);
      }
      
      // Count reviewer reviews
      metric.reviewers.forEach(reviewer => {
        const count = weekData.reviewerCounts.get(reviewer) || 0;
        weekData.reviewerCounts.set(reviewer, count + 1);
        
        if (metric.requestToReviewTime !== null) {
          const times = weekData.reviewerTimes.get(reviewer) || [];
          times.push(metric.requestToReviewTime);
          weekData.reviewerTimes.set(reviewer, times);
        }
      });
    });

    const aggregatedWeeklyUserMetrics: WeeklyUserMetrics[] = Array.from(weeklyUserData.values())
      .map((weekData) => {
        const reviewerMetrics: ReviewerMetrics[] = Array.from(weekData.reviewerCounts.entries())
          .map(([reviewer, count]) => ({
            reviewerName: reviewer,
            reviewCount: count,
            avgReviewTime: weekData.reviewerTimes.get(reviewer)
              ? weekData.reviewerTimes.get(reviewer)!.reduce((sum, time) => sum + time, 0) / weekData.reviewerTimes.get(reviewer)!.length
              : 0,
          }));
          
        const revieweeMetrics: RevieweeMetrics[] = Array.from(weekData.revieweeCounts.entries())
          .map(([reviewee, count]) => ({
            revieweeName: reviewee,
            prCount: count,
            avgTimeToReview: weekData.revieweeRequestTimes.get(reviewee)
              ? weekData.revieweeRequestTimes.get(reviewee)!.reduce((sum, time) => sum + time, 0) / weekData.revieweeRequestTimes.get(reviewee)!.length
              : 0,
            avgTimeToMerge: weekData.revieweeMergeTimes.get(reviewee)
              ? weekData.revieweeMergeTimes.get(reviewee)!.reduce((sum, time) => sum + time, 0) / weekData.revieweeMergeTimes.get(reviewee)!.length
              : 0,
          }));
          
        return {
          weekStartDate: weekData.weekStartDate,
          reviewerMetrics,
          revieweeMetrics,
        };
      })
      .sort((a, b) => a.weekStartDate.getTime() - b.weekStartDate.getTime());

    setWeeklyUserMetrics(aggregatedWeeklyUserMetrics);
      } catch (error) {
        console.error('Error processing data:', error);
        setMetrics([]);
        setWeeklyMetrics([]);
        setWeeklyUserMetrics([]);
      } finally {
        setIsProcessing(false);
      }
    }, 100); // Small delay to prevent UI blocking
  }, [data, oneMonthAgo]);

  // Memoize filtered metrics to prevent unnecessary recalculations
  const filteredMetrics = useMemo(() => {
    return metrics.filter(metric => {
      if (filters.selectedReviewee && metric.reviewee !== filters.selectedReviewee) {
        return false;
      }
      if (filters.selectedReviewer && !metric.reviewers.includes(filters.selectedReviewer)) {
        return false;
      }
      return true;
    });
  }, [metrics, filters.selectedReviewee, filters.selectedReviewer]);

  // Filter weekly metrics based on filtered metrics
  const filteredWeeklyMetrics = weeklyMetrics; // Could be enhanced to recalculate based on filtered data

  return {
    metrics: filteredMetrics,
    weeklyMetrics: filteredWeeklyMetrics,
    weeklyUserMetrics,
    allReviewees,
    allReviewers,
    filters,
    setFilters,
    loading: loading || isProcessing,
    error,
    dataSize,
    isProcessing,
  };
};