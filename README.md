# GitHub Review Insights

A React application that visualizes GitHub pull request review metrics to help teams understand their code review performance.

## Features

- **Review Time Metrics**: Track time from PR creation to first review and from review to merge
- **Weekly Aggregation**: View metrics aggregated by week to identify trends
- **Interactive Charts**: Line and bar charts powered by Recharts
- **GitHub GraphQL Integration**: Fetches data directly from GitHub's GraphQL API

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   - Create a GitHub Personal Access Token at [GitHub Settings](https://github.com/settings/tokens)
   - Required scopes: `repo` (for private repos) or `public_repo` (for public repos only)
   - Copy `.env.example` to `.env` and configure:
     ```
     VITE_GITHUB_TOKEN=your_github_token_here
     VITE_GITHUB_ORG=your_organization_name
     ```

3. **Start development server**:
   ```bash
   npm run dev
   ```

## Usage

1. Enter a GitHub repository name (organization is configured via environment variable)
2. Click "Analyze" to fetch and process the data
3. View the metrics:
   - **Request to Review Time**: Time from PR creation to first review
   - **Review to Merge Time**: Time from first review to merge
   - **Weekly trends**: Charts showing performance over time

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Architecture

- **React 19** with TypeScript
- **Apollo Client** for GraphQL queries
- **Recharts** for data visualization
- **Tailwind CSS** for styling
- **date-fns** for date manipulation
- **Vite** for build tooling