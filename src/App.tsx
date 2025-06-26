import { useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { githubClient } from './lib/github-client'
import { RepositoryInput } from './components/RepositoryInput'
import { MetricsSummary } from './components/MetricsSummary'
import { ReviewMetricsChart } from './components/ReviewMetricsChart'
import { UserMetricsChart } from './components/UserMetricsChart'
import { FilterControls } from './components/FilterControls'
import { DataSizeWarning } from './components/DataSizeWarning'
import { DateRangeInfo } from './components/DateRangeInfo'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useGitHubData } from './hooks/useGitHubData'
import './App.css'

function GitHubReviewInsights() {
  const [repository, setRepository] = useState<{ owner: string; repo: string } | null>(null)
  const [chartType, setChartType] = useState<'line' | 'bar'>('line')
  const [userChartType, setUserChartType] = useState<'bar' | 'pie'>('bar')
  const [userMetricType, setUserMetricType] = useState<'reviewer' | 'reviewee'>('reviewer')

  const { 
    weeklyMetrics, 
    weeklyUserMetrics, 
    allReviewees, 
    allReviewers, 
    filters, 
    setFilters, 
    loading, 
    error,
    dataSize,
    isProcessing
  } = useGitHubData({
    owner: repository?.owner || '',
    repo: repository?.repo || '',
  })

  const handleRepositorySubmit = (owner: string, repo: string) => {
    setRepository({ owner, repo })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            GitHub Review Insights
          </h1>
          <p className="text-lg text-gray-600">
            Analyze pull request review metrics and visualize team performance
          </p>
        </header>

        <RepositoryInput onSubmit={handleRepositorySubmit} loading={loading} />

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800">
              Error loading data: {error.message}
            </p>
          </div>
        )}

        {repository && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold text-gray-900">
                {repository.owner}/{repository.repo}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    chartType === 'line'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Line Chart
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    chartType === 'bar'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Bar Chart
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading metrics...</span>
              </div>
            ) : (
              <>
                <DateRangeInfo dataSize={dataSize} />
                <DataSizeWarning dataSize={dataSize} isProcessing={isProcessing} />
                
                <ErrorBoundary>
                  <FilterControls
                    allReviewees={allReviewees}
                    allReviewers={allReviewers}
                    selectedReviewee={filters.selectedReviewee}
                    selectedReviewer={filters.selectedReviewer}
                    onRevieweeChange={(reviewee) => setFilters({ ...filters, selectedReviewee: reviewee })}
                    onReviewerChange={(reviewer) => setFilters({ ...filters, selectedReviewer: reviewer })}
                  />
                </ErrorBoundary>
                
                <ErrorBoundary>
                  <MetricsSummary weeklyMetrics={weeklyMetrics} />
                </ErrorBoundary>
                
                {weeklyMetrics.length > 0 && (
                  <ErrorBoundary>
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Weekly Review Metrics
                      </h3>
                      <ReviewMetricsChart data={weeklyMetrics} chartType={chartType} />
                    </div>
                  </ErrorBoundary>
                )}
                
                {weeklyUserMetrics.length > 0 && (
                  <ErrorBoundary>
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          User Metrics
                        </h3>
                        <div className="flex gap-2">
                          <select
                            value={userMetricType}
                            onChange={(e) => setUserMetricType(e.target.value as 'reviewer' | 'reviewee')}
                            className="px-3 py-1 border border-gray-300 rounded-md text-sm"
                          >
                            <option value="reviewer">Reviewers</option>
                            <option value="reviewee">Reviewees</option>
                          </select>
                          <button
                            onClick={() => setUserChartType('bar')}
                            className={`px-4 py-1 rounded-md text-sm font-medium ${
                              userChartType === 'bar'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Bar
                          </button>
                          <button
                            onClick={() => setUserChartType('pie')}
                            className={`px-4 py-1 rounded-md text-sm font-medium ${
                              userChartType === 'pie'
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            Pie
                          </button>
                        </div>
                      </div>
                      <UserMetricsChart 
                        data={weeklyUserMetrics} 
                        metricType={userMetricType}
                        chartType={userChartType}
                      />
                    </div>
                  </ErrorBoundary>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <ApolloProvider client={githubClient}>
      <GitHubReviewInsights />
    </ApolloProvider>
  )
}

export default App
