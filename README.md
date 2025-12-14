# Live Poll Studio

Real-time interactive polling platform for educational environments, built with React, TypeScript, Socket.io, and Supabase.

## Architecture

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Real-time Communication**: Socket.io (WebSocket)
- **Backend**: Node.js + Express + Socket.io Server
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context API + React Query

## Setup Instructions

### Prerequisites

- Node.js 18+ & npm/bun installed
- Supabase account and project

### 1. Clone the Repository

```sh
git clone <YOUR_GIT_URL>
cd live-poll-studio-main
```

### 2. Setup Frontend

```sh
# Install dependencies
bun install  # or npm install

# Create environment file
cp .env.example .env

# Configure .env with your values:
# VITE_SOCKET_URL=http://localhost:3001
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_PUBLISHABLE_KEY=your_key

# Start frontend dev server
bun run dev  # or npm run dev
```

Frontend will run on `http://localhost:8080`

### 3. Setup Socket.io Backend

```sh
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure server/.env with your values:
# PORT=3001
# SUPABASE_URL=your_supabase_url
# SUPABASE_SERVICE_KEY=your_service_key
# NODE_ENV=development

# Start backend server
npm run dev
```

Backend will run on `http://localhost:3001`

### 4. Setup Supabase Database

Run the migration files in `supabase/migrations/` to create required tables:
- `polls`
- `poll_options`
- `participants`
- `votes`
- `chat_messages`

## Development

Start both servers for full functionality:

**Terminal 1 - Frontend:**
```sh
bun run dev
```

**Terminal 2 - Backend:**
```sh
cd server
npm run dev
```

## Technologies

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Real-time**: Socket.io (WebSocket)
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Forms**: React Hook Form + Zod
- **State**: React Context + React Query

## Socket.io Integration

This project uses Socket.io for all real-time polling interactions:

### Client Events
- `student:join` - Student joins poll
- `student:submit_answer` - Submit answer
- `teacher:start_poll` - Start new poll
- `teacher:end_poll` - End current poll
- `chat:send` - Send chat message

### Server Events
- `poll:started` - Poll has started
- `poll:update_results` - Live results update
- `poll:ended` - Poll ended
- `system:update_participants` - Participants changed
- `chat:message` - New chat message

**Note**: Supabase is used only for persistence (storing polls, votes, history), NOT for real-time synchronization.

## Deployment

### Frontend (Vercel/Netlify)

1. Build command: `bun run build` or `npm run build`
2. Output directory: `dist`
3. Set environment variables:
   - `VITE_SOCKET_URL` - Your Socket.io server URL
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

### Backend (Render/Railway)

1. Navigate to `server/` directory
2. Build command: `npm install && npm run build`
3. Start command: `npm start`
4. **Enable WebSocket support** in platform settings
5. Set environment variables:
   - `PORT`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_KEY`
   - `NODE_ENV=production`
   - `FRONTEND_URL` - Your frontend URL for CORS

## Project Structure

```
live-poll-studio-main/
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context (PollContext with Socket.io)
│   ├── pages/            # Route pages (Student/Teacher flows)
│   ├── sockets/          # Socket.io client instance
│   ├── integrations/     # Supabase client
│   └── lib/              # Utilities
├── server/               # Socket.io backend
│   ├── src/
│   │   ├── socket/       # Socket handlers & state
│   │   ├── index.ts      # Express + Socket.io server
│   │   └── supabaseClient.ts
│   └── package.json
├── supabase/             # Database migrations
└── package.json
```

## Features

✅ Real-time poll creation and distribution via Socket.io  
✅ Live answer submission and instant result updates  
✅ Student join/leave tracking  
✅ Timer synchronization across all clients  
✅ Chat functionality  
✅ Poll history persistence in Supabase  
✅ Responsive UI with Tailwind CSS  
✅ Type-safe with TypeScript  

## License

MIT
