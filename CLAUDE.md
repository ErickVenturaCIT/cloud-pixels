# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start development server (http://localhost:4321)
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Testing:**
- No test framework configured in this project

## Architecture Overview

This is a **Cloud Pixels** proposal management system built with Astro and Supabase. It manages commercial proposals with a full CRUD interface.

### Tech Stack
- **Frontend**: Astro 5.x with TypeScript
- **Database**: Supabase (PostgreSQL) 
- **Styling**: Custom CSS utilities (no framework)
- **Client Logic**: TypeScript modules

### Core Architecture

**Database Schema:**
- Single `propuestas` table with comprehensive proposal fields
- JSON columns for complex data: `servicios_seleccionados`, `entregables`, `proceso_timeline`
- RLS enabled with public policies for all operations

**Data Layer:**
- `src/lib/supabase.ts` - Supabase client and `PropuestasService` class
- All database operations go through `PropuestasService` static methods
- Centralized Supabase configuration with hardcoded credentials

**API Layer:**
- RESTful endpoints in `src/pages/api/propuestas/`
- `GET /api/propuestas` - List all proposals
- `GET /api/propuestas/[id]` - Get by ID
- `GET /api/propuestas/codigo/[codigo]` - Get by code
- `PUT /api/propuestas/[id]` - Update
- `DELETE /api/propuestas/[id]` - Delete

**Frontend Architecture:**
- Astro components in `src/components/` for reusable UI
- Page-specific TypeScript scripts in `src/scripts/`
- Client-side functionality imported via `src/scripts/index.ts`
- No global state management - relies on DOM manipulation

### Key Files
- `src/lib/supabase.ts` - Database service layer and TypeScript types
- `src/scripts/index.ts` - Central export point for all client scripts
- `src/pages/api/propuestas/index.ts` - Main API endpoint pattern
- `src/components/ProposalForm.astro` - Main form component

### Environment Configuration
Requires `.env.local` with:
```
SUPABASE_URL=https://cgchcozsszowdizlupkc.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Code Patterns
- API routes return JSON responses with error handling
- Client scripts are modular TypeScript files
- Components use Astro's component syntax
- Proposal codes auto-generated as `CP-YYYYMMDD-XXXX` format
- All database operations are async/await with try/catch