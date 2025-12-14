# Deployment Guide - Live Poll Studio

Complete guide for deploying the Live Poll Studio application with Socket.io backend.

## Overview

The application consists of two parts:
1. **Frontend** - React SPA (deploy to Vercel/Netlify)
2. **Backend** - Socket.io server (deploy to Render/Railway)

## Prerequisites

- Supabase account with a configured project
- GitHub repository
- Render/Railway account (for backend)
- Vercel/Netlify account (for frontend)

---

## Part 1: Deploy Socket.io Backend

### Option A: Deploy to Render

1. **Create New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Name**: `live-poll-studio-backend`
   - **Region**: Choose nearest to your users
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

3. **Set Environment Variables**
   ```
   PORT=3001
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Enable WebSocket Support**
   - Render automatically supports WebSockets on all plans
   - No additional configuration needed

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Note your backend URL: `https://your-service.onrender.com`

### Option B: Deploy to Railway

1. **Create New Project**
   - Go to [Railway Dashboard](https://railway.app/)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - Select the `server` directory as root
   - Railway auto-detects Node.js

3. **Set Environment Variables**
   ```
   PORT=3001
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_key
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

4. **Configure Build**
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. **Deploy**
   - Railway automatically deploys
   - Note your backend URL from the "Settings" tab

---

## Part 2: Deploy Frontend

### Option A: Deploy to Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com/)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: `bun run build` or `npm run build`
   - **Output Directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your frontend URL: `https://your-project.vercel.app`

5. **Update Backend CORS**
   - Go back to Render/Railway
   - Update `FRONTEND_URL` environment variable with your Vercel URL
   - Redeploy backend

### Option B: Deploy to Netlify

1. **Import Project**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "Add new site" → "Import an existing project"
   - Connect GitHub repository

2. **Configure Build**
   - **Build command**: `bun run build` or `npm run build`
   - **Publish directory**: `dist`

3. **Set Environment Variables**
   ```
   VITE_SOCKET_URL=https://your-backend-url.onrender.com
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   ```

4. **Deploy**
   - Click "Deploy site"
   - Note your Netlify URL

5. **Update Backend CORS**
   - Update `FRONTEND_URL` in backend environment variables
   - Redeploy backend

---

## Part 3: Configure Supabase

1. **Get Supabase Credentials**
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to Project Settings → API
   - Copy:
     - `Project URL` → Use as `SUPABASE_URL`
     - `anon public` key → Use as `VITE_SUPABASE_PUBLISHABLE_KEY`
     - `service_role` key → Use as `SUPABASE_SERVICE_KEY` (backend only)

2. **Run Database Migrations**
   - Go to SQL Editor in Supabase Dashboard
   - Copy contents of `supabase/migrations/*.sql`
   - Run the SQL to create tables

3. **Verify Tables Created**
   - Check Table Editor in Supabase
   - Should see: `polls`, `poll_options`, `participants`, `votes`, `chat_messages`

---

## Testing Deployment

1. **Test Backend Health**
   ```bash
   curl https://your-backend-url.onrender.com/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Test Frontend**
   - Visit your frontend URL
   - Open browser console (F12)
   - Should see: `✅ Connected to Socket.io server: <socket-id>`

3. **Test Full Flow**
   - Create a poll as Teacher
   - Join as Student (in incognito window)
   - Submit answer
   - Verify real-time updates work

---

## Troubleshooting

### Backend Issues

**Problem**: WebSocket connection fails
- **Solution**: Ensure WebSocket support is enabled on hosting platform
- Check CORS settings match frontend URL exactly

**Problem**: 500 errors on backend
- **Solution**: Check environment variables are set correctly
- Verify Supabase credentials
- Check logs: Render → Logs tab or Railway → Deployments → Logs

### Frontend Issues

**Problem**: Socket connection errors
- **Solution**: Verify `VITE_SOCKET_URL` points to correct backend URL (with https://)
- Check browser console for CORS errors
- Ensure backend `FRONTEND_URL` matches your frontend domain

**Problem**: Build fails
- **Solution**: Ensure all dependencies are installed
- Check Node.js version (18+ required)
- Clear cache and rebuild

### Database Issues

**Problem**: Polls not saving
- **Solution**: Verify Supabase migrations ran successfully
- Check service role key has correct permissions
- Review Supabase logs in Dashboard → Logs

---

## Production Checklist

- [ ] Backend deployed and health check returns 200
- [ ] Frontend deployed and accessible
- [ ] All environment variables configured correctly
- [ ] Supabase tables created via migrations
- [ ] CORS configured with correct frontend URL
- [ ] Socket.io connection established (check browser console)
- [ ] End-to-end test: Create poll → Join → Submit → See results
- [ ] Chat functionality works
- [ ] Poll history loads correctly

---

## Scaling Considerations

### For High Traffic

1. **Backend Scaling**
   - Use Redis adapter for Socket.io to support multiple backend instances
   - Configure horizontal scaling on Render/Railway

2. **Database**
   - Supabase automatically scales
   - Monitor connection pool usage

3. **Frontend**
   - Vercel/Netlify handle CDN and scaling automatically
   - No additional configuration needed

### Monitoring

- **Backend**: Use Render/Railway built-in metrics
- **Frontend**: Use Vercel/Netlify analytics
- **Database**: Supabase Dashboard → Reports

---

## Support

For issues:
1. Check browser console for errors
2. Check backend logs
3. Verify all environment variables
4. Test health endpoint
5. Review Supabase logs

## Cost Estimates

- **Render**: Free tier available, Starter ($7/mo) recommended for production
- **Railway**: $5 starting credit, ~$5-10/mo for small apps
- **Vercel**: Free tier sufficient for most use cases
- **Netlify**: Free tier sufficient for most use cases
- **Supabase**: Free tier includes 500MB database, 2GB bandwidth

Total monthly cost: $0-15 depending on traffic and tier choices.
