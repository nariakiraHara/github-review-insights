interface DataSizeWarningProps {
  dataSize: number;
  isProcessing: boolean;
}

export const DataSizeWarning = ({ dataSize, isProcessing }: DataSizeWarningProps) => {
  if (dataSize < 100) return null;

  const getWarningLevel = () => {
    if (dataSize >= 300) return 'danger';
    if (dataSize >= 200) return 'warning';
    return 'info';
  };

  const warningLevel = getWarningLevel();
  
  const getStyles = () => {
    switch (warningLevel) {
      case 'danger':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':  
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  const getMessage = () => {
    switch (warningLevel) {
      case 'danger':
        return {
          title: 'Very Large Dataset Detected',
          message: `Processing ${dataSize} pull requests. This may cause performance issues or browser freezing.`,
          suggestions: [
            'Consider filtering by specific reviewers or reviewees',
            'Use date range filters to limit the data',
            'Close other browser tabs to free memory',
            'Consider analyzing data in smaller chunks'
          ]
        };
      case 'warning':
        return {
          title: 'Large Dataset Detected', 
          message: `Processing ${dataSize} pull requests. Charts may take longer to render.`,
          suggestions: [
            'Consider using filters to focus on specific data',
            'Large datasets may slow down interactions'
          ]
        };
      default:
        return {
          title: 'Medium Dataset',
          message: `Processing ${dataSize} pull requests. Performance should be acceptable.`,
          suggestions: []
        };
    }
  };

  const { title, message, suggestions } = getMessage();

  return (
    <div className={`p-4 rounded-md border mb-4 ${getStyles()}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {warningLevel === 'danger' && (
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {warningLevel === 'warning' && (
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {warningLevel === 'info' && (
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium">
            {title}
          </h3>
          <div className="mt-2 text-sm">
            <p>{message}</p>
            {isProcessing && (
              <p className="mt-1 font-medium">
                Data is being processed in the background to prevent UI freezing...
              </p>
            )}
            {suggestions.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Recommendations:</p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};