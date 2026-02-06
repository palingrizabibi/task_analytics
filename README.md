# Task Analytics Dashboard

A full-stack web application for tracking tasks and analyzing productivity with real-time charts and insights.

## Features

- ✅ Task Management (Create, Read, Update, Delete)
- 📊 Real-time Analytics Dashboard
- 📈 Interactive Charts (Status, Priority, Trends)
- 🎯 Productivity Metrics
- 📱 Responsive Design
- 🔍 Error Monitoring with Sentry

## Tech Stack

- **Frontend & Backend**: Next.js 16
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Charts**: Chart.js + React Chart.js 2
- **Icons**: Lucide React
- **Monitoring**: Sentry
- **Deployment**: Vercel

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database (recommended: Supabase, Neon, or local PostgreSQL)
2. Copy `.env.example` to `.env.local`
3. Update the `DATABASE_URL` in `.env.local`:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/taskanalytics"
```

### 3. Initialize Database

```bash
npx prisma db push
```

### 4. Sentry Setup (Optional)

1. Create a Sentry account at https://sentry.io
2. Create a new project
3. Add your Sentry DSN to `.env.local`:

```env
NEXT_PUBLIC_SENTRY_DSN="your-sentry-dsn-here"
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `NEXT_PUBLIC_SENTRY_DSN` (optional)
4. Deploy!

### Database Migration on Production

After deployment, run the database migration:

```bash
npx prisma db push
```

## Usage

### Task Management
- Click "Add Task" to create new tasks
- Set priority levels (Low, Medium, High)
- Update task status (To Do, In Progress, Completed)
- Edit task titles inline
- Delete tasks when no longer needed

### Analytics Dashboard
- View completion rates and productivity metrics
- Analyze task distribution by status and priority
- Track daily completion trends
- Get insights on most productive days

## API Endpoints

- `GET /api/tasks` - Fetch all tasks
- `POST /api/tasks` - Create new task
- `PATCH /api/tasks/[id]` - Update task
- `DELETE /api/tasks/[id]` - Delete task

## Database Schema

```prisma
model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  status      Status   @default(TODO)
  priority    Priority @default(MEDIUM)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?
}

enum Status {
  TODO
  IN_PROGRESS
  COMPLETED
}

enum Priority {
  LOW
  MEDIUM
  HIGH
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for learning and development!