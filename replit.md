# Contract Management System

## Overview

This is a full-stack contract management system built with React, Express.js, and PostgreSQL. The application provides role-based access control with three user types (admin, employee, client) and comprehensive contract lifecycle management including document viewing, commenting, and collaboration features.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom color variables for brand consistency
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Authentication**: Replit Authentication with OpenID Connect
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple

### Key Design Decisions
- **Monorepo Structure**: Client, server, and shared code in a single repository
- **Type Safety**: Full TypeScript coverage with shared schema definitions
- **Role-Based Access**: Three-tier permission system (admin, employee, client)
- **Real-time Collaboration**: Comment system with line-specific annotations
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL with automatic cleanup
- **Authorization**: Role-based middleware with route protection
- **User Management**: Profile creation, role assignment, and permission control

### Database Schema
- **Users**: Profile information, roles, and authentication data
- **Contracts**: Document metadata, status tracking, and relationships
- **Comments**: Threaded commenting system with line-specific annotations
- **Permissions**: Employee-specific contract access controls
- **Sessions**: Secure session storage for authentication

### Contract Management
- **Document Viewing**: PDF viewer with zoom, rotation, and annotation capabilities
- **Status Tracking**: Workflow states (draft, review, approved, signed, completed)
- **Collaboration**: Real-time commenting with conflict resolution
- **Access Control**: Role-based permissions with granular contract access

### UI Components
- **Design System**: Consistent component library with shadcn/ui
- **Responsive Layout**: Adaptive navigation and content areas
- **Form Handling**: Validated forms with error handling
- **Loading States**: Skeleton loaders and progress indicators

## Data Flow

### Authentication Flow
1. User accesses protected route
2. Middleware checks session validity
3. If unauthenticated, redirects to Replit Auth
4. Upon successful auth, user profile is created/updated
5. Session is stored in PostgreSQL with TTL

### Contract Management Flow
1. Admin creates contract with client assignment
2. Employee permissions are set for contract access
3. Stakeholders can view, comment, and collaborate
4. Status updates trigger notifications
5. Final approval completes the contract lifecycle

### Comment System Flow
1. User selects line in PDF viewer
2. Comment is created with line number reference
3. Real-time updates notify other users
4. Comments can be resolved or escalated
5. Thread-based discussions maintain context

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18, React DOM, React Hook Form
- **Build Tools**: Vite, esbuild, TypeScript
- **UI Framework**: Radix UI primitives, Tailwind CSS
- **State Management**: TanStack Query, Zod validation

### Backend Dependencies
- **Database**: Drizzle ORM, Neon Database client
- **Authentication**: Passport.js, OpenID Connect client
- **Session Management**: Express session, connect-pg-simple
- **Utilities**: Memoizee for caching, date-fns for date handling

### Development Dependencies
- **Replit Integration**: Runtime error overlay, cartographer plugin
- **Code Quality**: ESLint, Prettier (implied)
- **Type Safety**: TypeScript, Zod schema validation

## Deployment Strategy

### Development Environment
- **Hot Reloading**: Vite dev server with HMR
- **Database**: Neon Database with connection pooling
- **Authentication**: Replit Auth with development callbacks
- **Asset Serving**: Vite middleware for static assets

### Production Build
- **Frontend**: Vite build with code splitting and optimization
- **Backend**: esbuild bundling with external dependencies
- **Database**: PostgreSQL with migration system
- **Static Assets**: Served from dist/public directory

### Environment Configuration
- **Database URL**: Required environment variable for PostgreSQL connection
- **Session Secret**: Secure session encryption key
- **Replit Integration**: REPL_ID and domain configuration
- **OIDC Configuration**: Issuer URL and client credentials

### Scalability Considerations
- **Database**: Connection pooling with Neon serverless
- **Sessions**: PostgreSQL storage with automatic cleanup
- **Caching**: Memoized API responses and computed values
- **Bundle Size**: Code splitting and lazy loading for optimal performance