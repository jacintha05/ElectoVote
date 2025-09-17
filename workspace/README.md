# ElectVote - Digital Voting Platform

A comprehensive online voting system with separate portals for voters and candidates, featuring secure authentication, real-time vote tracking, and email notifications.

## Features

### For Voters
- Register with name and unique voting ID
- Secure login system
- Vote for candidates with confirmation dialog
- One vote per voter enforcement
- Clean, intuitive voting interface

### For Candidates
- Register with comprehensive profile (name, age, party, symbol, motto, contact details)
- Personal dashboard showing vote count and ranking
- Ability to vote for other candidates
- Email notifications when receiving votes
- Real-time vote tracking

### General Features
- Live results page with real-time updates
- Vote statistics and turnout tracking
- Responsive design for all devices
- Secure session management
- Database-backed vote integrity

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **UI Library**: Radix UI + shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)
- **Email**: Nodemailer with Gmail SMTP
- **State Management**: TanStack Query

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/           # Utility functions and configurations
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Main app component with routing
├── server/                # Backend Express application
│   ├── db.ts             # Database connection
│   ├── emailService.ts   # Email notification service
│   ├── index.ts          # Server entry point
│   ├── replitAuth.ts     # Authentication setup
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
└── package.json         # Dependencies and scripts
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Ensure PostgreSQL database is available
   - Set DATABASE_URL environment variable
   - Push schema to database:
   ```bash
   npm run db:push
   ```

3. **Environment Variables**
   Required environment variables:
   ```
   DATABASE_URL=your_postgresql_connection_string
   SESSION_SECRET=your_session_secret
   REPL_ID=your_replit_app_id
   REPLIT_DOMAINS=your_domain.replit.app
   ISSUER_URL=https://replit.com/oidc
   
   # For email notifications (optional)
   EMAIL_USER=your_gmail_address
   EMAIL_PASSWORD=your_gmail_app_password
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```
   This starts both the Express server and Vite development server.

## Usage Guide

### Getting Started

1. **Visit the Landing Page**
   - Choose between "Voter Portal" or "Candidate Portal"

2. **For Voters**
   - Register with your name and a unique voting ID
   - Log in using your credentials
   - Browse candidates and vote for your choice
   - Confirm your vote in the dialog that appears

3. **For Candidates**
   - Register with complete profile information
   - Log in to access your dashboard
   - View your vote count and ranking
   - Receive email notifications when votes are cast

4. **View Results**
   - Visit the "Live Results" page for real-time vote counts
   - See candidate rankings and vote percentages
   - Monitor election turnout statistics

### API Endpoints

- `POST /api/voters/register` - Register a new voter
- `POST /api/voters/login` - Voter login
- `POST /api/candidates/register` - Register a new candidate
- `POST /api/candidates/login` - Candidate login
- `GET /api/candidates` - Get all candidates
- `POST /api/votes` - Cast a vote
- `GET /api/stats` - Get election statistics
- `GET /api/auth/user` - Get current authenticated user

## Email Configuration

To enable email notifications:

1. Create a Gmail App Password:
   - Go to Google Account settings
   - Enable 2-factor authentication
   - Generate an App Password for the application

2. Set environment variables:
   ```
   EMAIL_USER=your_gmail_address
   EMAIL_PASSWORD=your_generated_app_password
   ```

## Database Schema

The application uses PostgreSQL with the following main tables:

- **users** - Authentication (required for Replit Auth)
- **sessions** - Session storage (required for Replit Auth)
- **voters** - Voter information and credentials
- **candidates** - Candidate profiles and vote counts
- **votes** - Individual vote records for audit trail

## Security Features

- Secure session management with PostgreSQL storage
- One vote per voter enforcement at database level
- Vote audit trail for transparency
- Secure authentication via OpenID Connect
- Protected API endpoints with proper authorization

## Development Notes

- The application uses TypeScript throughout for type safety
- Database operations use Drizzle ORM for type-safe queries
- Form validation uses Zod schemas
- Real-time updates implemented with TanStack Query
- Responsive design with Tailwind CSS
- Email service has fallback error handling

## Troubleshooting

1. **Database Connection Issues**
   - Verify DATABASE_URL is correctly set
   - Ensure PostgreSQL server is running
   - Run `npm run db:push` to sync schema

2. **Email Not Working**
   - Check EMAIL_USER and EMAIL_PASSWORD are set
   - Verify Gmail App Password is correct
   - Application will continue working without email

3. **Authentication Issues**
   - Ensure all Replit Auth environment variables are set
   - Check REPLIT_DOMAINS matches your deployment domain

## License

This project is built for educational and demonstration purposes.