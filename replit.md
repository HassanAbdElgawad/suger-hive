# SugarHive - Operational Management System

## Overview

SugarHive is a centralized operational management system designed for multi-branch businesses. It provides tools for managing daily tasks, checklists, employee training, team management, and branch performance tracking. The application follows a modern full-stack architecture with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **Internationalization**: Custom i18n system with English/Arabic language toggle and RTL support (`client/src/lib/language.tsx`)
- **Build Tool**: Vite with hot module replacement

The frontend follows a page-based structure where each route corresponds to a page component in `client/src/pages/`. Reusable UI components are organized in `client/src/components/ui/` following the shadcn/ui pattern.

### Backend Architecture
- **Framework**: Express 5 running on Node.js
- **Language**: TypeScript with ES modules
- **HTTP Server**: Node's native http module wrapping Express
- **Development**: tsx for TypeScript execution without compilation

The server uses a simple modular structure:
- `server/index.ts` - Entry point with middleware setup
- `server/routes.ts` - API route registration
- `server/storage.ts` - Data access layer with interface abstraction
- `server/vite.ts` - Development server integration with Vite HMR

### Data Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured via DATABASE_URL environment variable)
- **Schema**: Defined in `shared/schema.ts` using Drizzle's schema builder
- **Validation**: Zod schemas generated from Drizzle schemas via drizzle-zod
- **Migrations**: Managed via `drizzle-kit push` command

Currently implements an in-memory storage adapter (`MemStorage`) that can be swapped for PostgreSQL by implementing the `IStorage` interface with Drizzle queries.

### Build System
- **Client Build**: Vite builds React app to `dist/public/`
- **Server Build**: esbuild bundles server code to `dist/index.cjs`
- Custom build script in `script/build.ts` handles both client and server builds

### Key Design Patterns
1. **Storage Interface Pattern**: `IStorage` interface allows swapping between in-memory and database implementations
2. **Shared Types**: Schema definitions in `shared/` directory are used by both client and server
3. **Path Aliases**: TypeScript paths configured for `@/` (client), `@shared/` (shared), and `@assets/` (assets)

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle Kit**: Database migration and schema management tool

### UI Framework
- **Radix UI**: Headless component primitives for accessibility
- **shadcn/ui**: Pre-built component library (new-york style variant)
- **Lucide React**: Icon library

### Data Visualization
- **Recharts**: Chart library for performance dashboards and reports

### Development Tools
- **Vite**: Frontend build tool with HMR support
- **Replit Plugins**: Dev banner, cartographer, and runtime error overlay for Replit environment

### Session Management
- **connect-pg-simple**: PostgreSQL session store (available but not yet implemented)
- **express-session**: Session middleware (dependency present for future auth implementation)