# Project Camp

A project management system with authentication, role-based access control, and task tracking.

## Tech Stack

- **Backend**: Node.js, Express, MongoDB
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Authentication**: JWT with refresh tokens
- **Deployment**: Render (backend + frontend)

## Quick Start

### Local Setup

```bash
npm install
cp .env.example .env
# Configure .env with your MongoDB URI
npm run dev
```

Access at `http://localhost:8080`

### Seed Test Data

```bash
npm run seed
```

**Test Accounts:**
- Admin: `admin@projectcamp.com` / `Admin@123`
- Project Admin: `projectadmin@projectcamp.com` / `Admin@123`
- Member: `member@projectcamp.com` / `Member@123`

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment guide.

**Quick Steps:**
1. Setup MongoDB Atlas (free tier)
2. Push to GitHub
3. Deploy to Render with `render.yaml`
4. Set `MONGO_URI` environment variable

## Features

- JWT authentication with email verification
- Three-tier role system (Admin, Project Admin, Member)
- Project and team member management
- Task and subtask tracking
- File attachments
- Project notes

## API Endpoints

Full API documentation available in [README_FULL.md](README_FULL.md)

## License

ISC

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a database user with read/write access
3. Whitelist all IPs (0.0.0.0/0) in Network Access
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/projectcamp`
5. Replace `<password>` with your actual database password

### Optional: Email Setup with Mailtrap

1. Sign up at [Mailtrap](https://mailtrap.io)
2. Go to Email Testing → Inboxes → SMTP Settings
3. Copy Username and Password
4. Add to Render environment variables

### Generate Secrets Locally

For local development, generate secure secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add these to your `.env` file for `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET`

## Production Considerations

## API Documentation

### Authentication Endpoints
- POST `/api/v1/auth/register` - Register new user
- POST `/api/v1/auth/login` - Login user
- POST `/api/v1/auth/logout` - Logout user
- GET `/api/v1/auth/current-user` - Get current user
- POST `/api/v1/auth/change-password` - Change password
- POST `/api/v1/auth/refresh-token` - Refresh access token
- GET `/api/v1/auth/verify-email/:token` - Verify email
- POST `/api/v1/auth/forgot-password` - Request password reset
- POST `/api/v1/auth/reset-password/:token` - Reset password

### Project Endpoints
- GET `/api/v1/projects` - Get user projects
- POST `/api/v1/projects` - Create project
- GET `/api/v1/projects/:projectId` - Get project details
- PUT `/api/v1/projects/:projectId` - Update project
- DELETE `/api/v1/projects/:projectId` - Delete project
- GET `/api/v1/projects/:projectId/members` - Get project members
- POST `/api/v1/projects/:projectId/members` - Add member
- PUT `/api/v1/projects/:projectId/members/:userId` - Update member role
- DELETE `/api/v1/projects/:projectId/members/:userId` - Remove member

### Task Endpoints
- GET `/api/v1/tasks/:projectId` - Get project tasks
- POST `/api/v1/tasks/:projectId` - Create task
- GET `/api/v1/tasks/:projectId/t/:taskId` - Get task details
- PUT `/api/v1/tasks/:projectId/t/:taskId` - Update task
- DELETE `/api/v1/tasks/:projectId/t/:taskId` - Delete task
- POST `/api/v1/tasks/:projectId/t/:taskId/subtasks` - Create subtask
- PUT `/api/v1/tasks/:projectId/st/:subTaskId` - Update subtask
- DELETE `/api/v1/tasks/:projectId/st/:subTaskId` - Delete subtask

### Note Endpoints
- GET `/api/v1/notes/:projectId` - Get project notes
- POST `/api/v1/notes/:projectId` - Create note
- GET `/api/v1/notes/:projectId/n/:noteId` - Get note details
- PUT `/api/v1/notes/:projectId/n/:noteId` - Update note
- DELETE `/api/v1/notes/:projectId/n/:noteId` - Delete note

## License

ISC
