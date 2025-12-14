# Quick Start Guide

## Installation

### 1. Install Frontend Dependencies

```bash
# From project root
bun install
# or
npm install
```

### 2. Install Backend Dependencies

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Return to root
cd ..
```

### 3. Configure Environment Variables

**Frontend (.env in root):**
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SOCKET_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_anon_key
```

**Backend (server/.env):**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key
NODE_ENV=development
```

### 4. Setup Supabase Database

1. Go to your Supabase project
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/20251213102258_e50e1ec0-ae35-47b7-a80d-191c9d58f159.sql`

## Running the Application

### Start Both Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

Backend will start on `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
# From project root
bun run dev
# or
npm run dev
```

Frontend will start on `http://localhost:8080`

## Verify Setup

1. **Check Backend Health:**
   Open browser: `http://localhost:3001/health`
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check Frontend:**
   Open browser: `http://localhost:8080`
   Open Console (F12)
   Should see: `✅ Connected to Socket.io server: <socket-id>`

## Usage

### As Teacher:
1. Go to `http://localhost:8080`
2. Click "Continue as Teacher"
3. Create a poll with question, options, and duration
4. Click "Ask Question"
5. Share the poll with students
6. Watch real-time responses

### As Student:
1. Open `http://localhost:8080` in a different browser/incognito
2. Click "Continue as Student"
3. Enter your name
4. Wait for teacher to start a poll
5. Answer the question
6. View results

## Development Notes

- Frontend hot-reloads on file changes
- Backend auto-restarts with tsx watch
- Socket connections are logged in backend console
- Check browser console for frontend socket events

## Troubleshooting

**Backend won't start:**
- Ensure port 3001 is available
- Check environment variables are set
- Verify Supabase credentials

**Frontend can't connect:**
- Verify backend is running
- Check VITE_SOCKET_URL in .env
- Look for CORS errors in console

**No real-time updates:**
- Check Socket.io connection in browser console
- Verify backend logs show socket events
- Ensure both servers are running

## Next Steps

- Read [README.md](./README.md) for full documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- Check [server/README.md](./server/README.md) for backend details
