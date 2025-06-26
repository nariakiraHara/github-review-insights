export interface PullRequest {
  id: string;
  number: number;
  title: string;
  createdAt: string;
  mergedAt: string | null;
  state: 'OPEN' | 'CLOSED' | 'MERGED';
  author: {
    login: string;
  };
  reviews: {
    nodes: Review[];
  };
  reviewRequests: {
    nodes: ReviewRequest[];
  };
}

export interface Review {
  id: string;
  createdAt: string;
  state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED';
  author: {
    login: string;
  };
}

export interface ReviewRequest {
  id: string;
  requestedReviewer: {
    login: string;
  } | null;
}

export interface ReviewMetrics {
  prNumber: number;
  title: string;
  createdAt: Date;
  mergedAt: Date | null;
  requestToReviewTime: number | null; // minutes
  reviewToMergeTime: number | null; // minutes
  weekStartDate: Date;
  reviewee: string; // PR author
  reviewers: string[]; // List of reviewers
}

export interface WeeklyMetrics {
  weekStartDate: Date;
  avgRequestToReviewTime: number;
  avgReviewToMergeTime: number;
  totalPRs: number;
}

export interface ReviewerMetrics {
  reviewerName: string;
  reviewCount: number;
  avgReviewTime: number; // minutes from request to review
}

export interface RevieweeMetrics {
  revieweeName: string;
  prCount: number;
  avgTimeToReview: number; // minutes from creation to first review
  avgTimeToMerge: number; // minutes from first review to merge
}

export interface WeeklyUserMetrics {
  weekStartDate: Date;
  reviewerMetrics: ReviewerMetrics[];
  revieweeMetrics: RevieweeMetrics[];
}