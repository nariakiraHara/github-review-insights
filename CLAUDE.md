# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Vite HMR
- `npm run build` - Build for production (runs TypeScript compiler then Vite build)
- `npm run lint` - Run ESLint on all files
- `npm run preview` - Preview production build locally

## Project Architecture

This is a GitHub Review Insights application - a React + TypeScript + Vite web app for visualizing GitHub pull request review speed and metrics. The application structure:

- **Frontend Framework**: React 19 with TypeScript
- **Build Tool**: Vite with @vitejs/plugin-react
- **Entry Point**: `src/main.tsx` renders the root `App` component
- **Styling**: CSS modules (App.css, index.css)
- **TypeScript Config**: Split configuration with `tsconfig.app.json` for app code and `tsconfig.node.json` for build tools

## Key Configuration Details

- **ESLint**: Uses flat config with TypeScript ESLint, React Hooks, and React Refresh plugins
- **TypeScript**: Strict mode enabled with bundler module resolution
- **Build Output**: Static files generated to `dist/` directory (ignored by ESLint)
- **Development**: Hot Module Replacement (HMR) enabled via Vite

## Application Purpose

GitHub Review Insights visualizes pull request review metrics to help teams understand their code review performance, including:
- Review response times
- Review completion speed
- Team review patterns and bottlenecks

## Code Standards

- All source code in `src/` directory
- TypeScript strict mode enforced
- React Hooks and React Refresh linting rules active
- No unused locals or parameters allowed