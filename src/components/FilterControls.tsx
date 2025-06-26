interface FilterControlsProps {
  allReviewees: string[];
  allReviewers: string[];
  selectedReviewee?: string;
  selectedReviewer?: string;
  onRevieweeChange: (reviewee: string | undefined) => void;
  onReviewerChange: (reviewer: string | undefined) => void;
}

export const FilterControls = ({
  allReviewees,
  allReviewers,
  selectedReviewee,
  selectedReviewer,
  onRevieweeChange,
  onReviewerChange,
}: FilterControlsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h3 className="text-lg font-semibold mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="reviewee-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Reviewee (PR Author)
          </label>
          <select
            id="reviewee-filter"
            value={selectedReviewee || ''}
            onChange={(e) => onRevieweeChange(e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Reviewees</option>
            {allReviewees.map(reviewee => (
              <option key={reviewee} value={reviewee}>
                {reviewee}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="reviewer-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Reviewer
          </label>
          <select
            id="reviewer-filter"
            value={selectedReviewer || ''}
            onChange={(e) => onReviewerChange(e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Reviewers</option>
            {allReviewers.map(reviewer => (
              <option key={reviewer} value={reviewer}>
                {reviewer}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {(selectedReviewee || selectedReviewer) && (
        <div className="mt-4 flex gap-2">
          {selectedReviewee && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Reviewee: {selectedReviewee}
              <button
                onClick={() => onRevieweeChange(undefined)}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </span>
          )}
          {selectedReviewer && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Reviewer: {selectedReviewer}
              <button
                onClick={() => onReviewerChange(undefined)}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
};