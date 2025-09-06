# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RiNeco - A Claude Hackathon project for AI-powered sustainable packaging material recommendations. The application helps businesses transition from traditional packaging to eco-friendly alternatives through a 3-step process: scenario selection, requirements analysis, and AI-generated recommendations.

## Commands

### Development
```bash
npm run dev          # Start both Next.js and Convex servers concurrently
npm run dev:next     # Next.js development server only (port 3000)
npm run dev:convex   # Convex backend server only
npm run build        # Production build
npm run start        # Production server
npm run lint         # Run ESLint
```

### Environment Setup
Create `.env.local` file with:
```
ANTHROPIC_API_KEY=your-api-key-here
NEXT_PUBLIC_CONVEX_URL=your-convex-url
```

## Architecture

### Tech Stack
- **Frontend**: Next.js 15.5.2 (App Router), React 19.1.0, TypeScript 5
- **Backend**: Convex (real-time backend-as-a-service)
- **AI**: Anthropic Claude API (claude-3-5-sonnet-20241022)
- **Styling**: Tailwind CSS v4 with custom brand colors
- **UI Components**: Custom components with shadcn/ui patterns

### Application Flow
1. **Scenario Selection** (`/scenarios`): User selects from 11 predefined packaging categories
2. **Requirements Input** (`/scenarios/[id]`): Upload documents and specify performance requirements
3. **AI Analysis** (`/api/analyze-requirements`): Claude extracts requirements from uploaded documents
4. **Recommendations** (`/proposals`): Display sustainable alternatives with comparison charts

### Key Directories
- `src/app/api/analyze-requirements/`: Claude API integration for document analysis
- `src/app/scenarios/`: Product scenario management with dynamic routing
- `src/app/proposals/`: Results display with sustainability metrics
- `convex/`: Backend configuration and real-time data management

### Data Model
The application supports 11 packaging scenarios, each with:
- Current material composition and percentages
- Performance requirements (barrier properties, strength, temperature resistance)
- Environmental impact metrics
- Alternative material recommendations

Scenarios are defined in `src/app/scenarios/data.ts` with detailed specifications for each packaging type.

### API Integration
The Claude API integration in `/api/analyze-requirements/route.ts`:
- Accepts PDF/text documents via multipart form data
- Extracts material requirements using structured prompts
- Returns JSON with barrier properties, strength requirements, and temperature specifications
- Uses streaming responses for real-time feedback

### Styling System
- Custom brand colors defined in CSS variables (`--brand-main: #00897b`)
- Tailwind v4 configuration with custom theme
- Component-specific styles using CSS modules where needed
- Responsive design with mobile-first approach

## Important Considerations

### File Upload Handling
- Supports PDF, Word, Excel, CSV, text, and image files
- PDF parsing implemented with `pdf-parse` library
- Maximum file size and validation should be configured based on requirements

### State Management
- Convex handles real-time state synchronization
- Local state for UI interactions using React hooks
- Form data persisted through the multi-step workflow

### Error Handling Patterns
- API routes return structured error responses
- Client-side error boundaries needed for production
- Loading states implemented with animated feedback

### Japanese Localization
The entire application is in Japanese. When making changes:
- Maintain Japanese UI text consistency
- Keep technical terms in context (e.g., バリア性 for barrier properties)
- Preserve the professional tone for B2B audience

## Development Tips

### When Adding New Features
1. Follow the existing App Router patterns in `src/app/`
2. Use the established component structure in `src/app/components/`
3. Maintain TypeScript strict mode compliance
4. Keep the 3-step workflow intuitive

### When Modifying AI Integration
1. Test with various document formats
2. Ensure extracted requirements match the data model structure
3. Handle API rate limits and errors gracefully
4. Keep prompts focused on sustainability metrics

### Performance Optimization
- Implement proper code splitting for route segments
- Use dynamic imports for heavy components (charts, etc.)
- Cache API responses where appropriate
- Optimize images and assets in `/public`