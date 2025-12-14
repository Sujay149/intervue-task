# Live Poll Studio - Socket.io Server

Real-time WebSocket server for Live Poll Studio using Socket.io.

## Features

- Real-time poll distribution and synchronization
- Live answer submission and result updates
- In-memory state management for active polls
- Supabase integration for persistence
- Automatic poll timer management
- Chat message broadcasting

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables:
```env
PORT=3001
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
NODE_ENV=development
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Production

Build and run:
```bash
npm run build
npm start
```

## Socket Events

### Client → Server

- `student:join` - Student joins a poll
- `student:submit_answer` - Student submits answer
- `teacher:start_poll` - Teacher starts a new poll
- `teacher:end_poll` - Teacher ends poll manually
- `teacher:next_question` - Teacher moves to next question
- `chat:send` - Send chat message

### Server → Client

- `poll:state` - Current poll state (on join)
- `poll:started` - New poll has started
- `poll:new_question` - Teacher started next question
- `poll:update_results` - Live results update
- `poll:ended` - Poll ended with final results
- `system:update_participants` - Participant list changed
- `chat:message` - New chat message

## Deployment

### Render / Railway

1. Connect your Git repository
2. Set environment variables
3. Build command: `cd server && npm install && npm run build`
4. Start command: `cd server && npm start`
5. Enable WebSocket support in platform settings

### Manual Deployment

1. Build the server: `npm run build`
2. Copy `dist/` folder and `package.json` to server
3. Install production dependencies: `npm install --production`
4. Start: `node dist/index.js`

## Health Check

GET `/health` - Returns server status and timestamp
