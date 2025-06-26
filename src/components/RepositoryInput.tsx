import { useState } from 'react';

interface RepositoryInputProps {
  onSubmit: (owner: string, repo: string) => void;
  loading?: boolean;
}

export const RepositoryInput = ({ onSubmit, loading = false }: RepositoryInputProps) => {
  const [repo, setRepo] = useState('');
  const fixedOrg = import.meta.env.VITE_GITHUB_ORG;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fixedOrg && repo.trim()) {
      onSubmit(fixedOrg, repo.trim());
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Repository Settings</h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {fixedOrg && (
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organization
            </label>
            <div className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600">
              {fixedOrg}
            </div>
          </div>
        )}
        
        <div className="flex-1">
          <label htmlFor="repo" className="block text-sm font-medium text-gray-700 mb-1">
            Repository Name
          </label>
          <input
            type="text"
            id="repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            placeholder="e.g., react"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
        </div>
        
        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading || !fixedOrg || !repo.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Analyze'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 space-y-3">
        {!fixedOrg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Error:</strong> Please set <code>VITE_GITHUB_ORG</code> in your environment variables.
            </p>
          </div>
        )}
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You need to set <code>VITE_GITHUB_TOKEN</code> and <code>VITE_GITHUB_ORG</code> in your environment variables.
          </p>
        </div>
      </div>
    </div>
  );
};