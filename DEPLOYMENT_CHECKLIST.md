# Pre-Deployment Checklist

## Before Pushing to GitHub

### Code Review
- [x] All features working locally
- [x] Error handling middleware added
- [x] Frontend connects to correct backend port (8080)
- [x] Environment variables documented
- [x] No sensitive data in code
- [x] `.gitignore` includes `.env` and `node_modules`

### Configuration Files
- [x] `package.json` has correct start script
- [x] `render.yaml` configured correctly
- [x] `.env.example` created with all required variables
- [x] Port set to 8080 (not 8000)
- [x] Node version specified (>=18.0.0)

### Testing
- [x] All endpoints tested locally
- [x] Authentication flow works
- [x] Project creation/management works
- [x] Task and subtask operations work
- [x] Notes functionality works
- [x] Role-based permissions enforced
- [x] Error messages properly formatted as JSON

## MongoDB Atlas Setup

- [ ] MongoDB Atlas account created
- [ ] Free cluster (M0) created
- [ ] Database user created with read/write permissions
- [ ] Network Access configured (0.0.0.0/0)
- [ ] Connection string obtained and tested
- [ ] Connection string includes database name (`/projectcamp`)
- [ ] Password special characters URL-encoded if needed

## GitHub Repository

- [ ] Repository created on GitHub
- [ ] Local git initialized
- [ ] `.gitignore` in place
- [ ] All files committed
- [ ] Pushed to `main` branch
- [ ] Repository is accessible (public or Render has access)

## Render Setup

- [ ] Render account created
- [ ] Email verified
- [ ] Payment method added (even for free tier)

## Render Configuration

- [ ] Web Service created
- [ ] GitHub repository connected
- [ ] `render.yaml` detected and applied
- [ ] Build command set: `npm install`
- [ ] Start command set: `npm start`
- [ ] Environment set: Node

## Environment Variables

### Required (Must Set Manually)
- [ ] `MONGO_URI` - Your MongoDB Atlas connection string

### Optional (For Email Features)
- [ ] `MAILTRAP_SMTP_USER` - If using email verification
- [ ] `MAILTRAP_SMTP_PASS` - If using email verification

### Auto-Set by Render (via render.yaml)
- [x] `NODE_ENV` - Set to production
- [x] `PORT` - Set to 8080
- [x] `ACCESS_TOKEN_SECRET` - Auto-generated
- [x] `REFRESH_TOKEN_SECRET` - Auto-generated
- [x] `ACCESS_TOKEN_EXPIRY` - Set to 1d
- [x] `REFRESH_TOKEN_EXPIRY` - Set to 10d
- [x] `FRONTEND_URL` - Auto-set from service URL
- [x] `CROSS_ORIGIN` - Auto-set from service URL
- [x] `MAILTRAP_SMTP_HOST` - Set to smtp.mailtrap.io
- [x] `MAILTRAP_SMTP_PORT` - Set to 2525

## Post-Deployment

- [ ] Service deployed successfully
- [ ] No errors in Render logs
- [ ] Homepage loads at your Render URL
- [ ] Can register new user
- [ ] Can login successfully
- [ ] Can create project
- [ ] Can create tasks
- [ ] Can add project members
- [ ] All role permissions work correctly

## Optional Enhancements

- [ ] Custom domain configured
- [ ] SSL certificate verified (auto on Render)
- [ ] Monitoring/logging set up
- [ ] Database backup strategy
- [ ] Seed test data (run `npm run seed` in Render shell)
- [ ] Error tracking service (e.g., Sentry)
- [ ] Performance monitoring

## Common Issues to Check

- [ ] Frontend API URL matches backend URL
- [ ] CORS properly configured
- [ ] MongoDB connection string format correct
- [ ] No hardcoded localhost URLs in production code
- [ ] Error responses return JSON (not HTML)
- [ ] All async handlers wrapped properly

## Documentation

- [x] README.md updated with deployment instructions
- [x] DEPLOYMENT.md created with detailed steps
- [x] Test accounts documented
- [x] API endpoints documented
- [x] Environment variables documented

## Security Review

- [ ] No passwords in code
- [ ] JWT secrets are strong and unique
- [ ] MongoDB uses authentication
- [ ] CORS configured appropriately
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Mongoose)
- [ ] XSS protection in place
- [ ] Rate limiting considered for production

---

## Quick Command Reference

### Start Local Development
```bash
npm run dev
```

### Seed Test Data
```bash
npm run seed
```

### Push to GitHub
```bash
git add .
git commit -m "Your message"
git push origin main
```

### View Render Logs
```
Render Dashboard → Your Service → Logs
```

### Access Render Shell
```
Render Dashboard → Your Service → Shell
```

---

**Ready to Deploy?** Follow the steps in [DEPLOYMENT.md](DEPLOYMENT.md)
