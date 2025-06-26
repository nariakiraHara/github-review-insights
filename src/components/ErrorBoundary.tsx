import { Component } from 'react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="bg-red-50 border border-red-200 rounded-md p-6 m-4">
          <div className="flex items-center mb-4">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Something went wrong
              </h3>
            </div>
          </div>
          <div className="text-sm text-red-700">
            <p className="mb-2">The application encountered an error while processing the data.</p>
            <p className="mb-4">This often happens when:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              <li>The dataset is too large to process</li>
              <li>There's insufficient memory available</li>
              <li>The browser tab has run out of resources</li>
            </ul>
            <p className="font-medium">Suggested solutions:</p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Try filtering the data to a smaller subset</li>
              <li>Use a more recent time range</li>
              <li>Refresh the page and try again</li>
              <li>Close other browser tabs to free up memory</li>
            </ul>
          </div>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Reload Page
            </button>
          </div>
          {this.state.error && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-medium text-red-800 hover:text-red-900">
                Technical Details
              </summary>
              <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-auto">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}