# ElectVote - Digital Voting Platform

## Overview

ElectVote is a secure digital voting platform built with React and Express.js that enables online elections with robust authentication and real-time results. The application provides separate portals for voters and candidates, featuring secure voter registration, candidate management, vote casting, and live results tracking. The platform emphasizes security, transparency, and user experience while maintaining data integrity throughout the voting process.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Radix UI primitives with shadcn/ui components for consistent design
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Authentication**: OpenID Connect (OIDC) integration with Replit Auth
- **Session Management**: Express sessions with PostgreSQL session store
- **API Design**: RESTful endpoints with consistent error handling and logging

### Database Design
- **Primary Database**: PostgreSQL with Neon serverless adapter
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Structure**:
  - Users table for authentication (mandatory for Replit Auth)
  - Voters table with unique voting IDs and vote tracking
  - Candidates table with campaign information and vote counts
  - Votes table for audit trail and data integrity
  - Sessions table for secure session storage

### Authentication & Authorization
- **Primary Auth**: Replit OpenID Connect integration with automatic user provisioning
- **Session Security**: Secure HTTP-only cookies with configurable TTL
- **Access Control**: Role-based access with voter/candidate separation
- **Security Features**: CSRF protection, secure session storage, and encrypted vote data

### Email Integration
- **Service**: Nodemailer with Gmail SMTP configuration
- **Use Cases**: Vote confirmation notifications to candidates
- **Template System**: HTML email templates with embedded styling
- **Configuration**: Environment-based SMTP credentials with fallback support

### Vote Management System
- **Vote Integrity**: One-vote-per-voter enforcement with database constraints
- **Audit Trail**: Complete vote tracking with timestamps and voter verification
- **Real-time Updates**: Live vote count updates and result visualization
- **Data Privacy**: Voter anonymity while maintaining election integrity

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless database adapter
- **drizzle-orm & drizzle-kit**: Type-safe ORM and migration toolkit
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React router
- **@radix-ui/***: Accessible UI component primitives

### Authentication & Security
- **openid-client**: OpenID Connect client implementation
- **passport**: Authentication middleware framework
- **express-session**: Session management middleware
- **connect-pg-simple**: PostgreSQL session store adapter

### Email & Communication
- **nodemailer**: Email sending capability
- **@types/nodemailer**: TypeScript definitions for email service

### Development & Build Tools
- **vite**: Fast build tool and development server
- **@vitejs/plugin-react**: React support for Vite
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for development

### Styling & UI
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant management
- **clsx & tailwind-merge**: Conditional class name utilities

### Form & Validation
- **react-hook-form**: Performant form library
- **@hookform/resolvers**: Form validation resolvers
- **zod & drizzle-zod**: Runtime type validation and schema generation

### Utility Libraries
- **date-fns**: Date manipulation and formatting
- **lucide-react**: Icon library
- **cmdk**: Command palette functionality
- **memoizee**: Function memoization for performance optimization