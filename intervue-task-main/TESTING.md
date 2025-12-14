# Pre-Deployment Testing Checklist

## Local Testing (Before Deployment)

### Setup
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
bun run dev
```

### Test 1: Socket Connection ✅
- [ ] Open `http://localhost:8080`
- [ ] Open browser console (F12)
- [ ] Verify: `✅ Connected to Socket.io server: <socket-id>`
- [ ] Backend console shows: `Client connected: <socket-id>`

### Test 2: Teacher Creates Poll ✅
- [ ] Click "Continue as Teacher"
- [ ] Enter question: "What is 2+2?"
- [ ] Add options: "3", "4", "5", "6"
- [ ] Mark "4" as correct
- [ ] Select duration: 60 seconds
- [ ] Click "Ask Question"
- [ ] Verify: Redirected to live results screen
- [ ] Backend logs: `Teacher started poll: poll_<timestamp>`

### Test 3: Student Joins Poll ✅
- [ ] Open incognito/private window: `http://localhost:8080`
- [ ] Click "Continue as Student"
- [ ] Enter name: "Alice"
- [ ] Click "Continue"
- [ ] Verify: Automatically sees active poll
- [ ] Backend logs: `Student Alice (student_<id>) joined poll <poll_id>`

### Test 4: Student Submits Answer ✅
- [ ] Student selects an option (e.g., "4")
- [ ] Click "Submit"
- [ ] Verify: Instantly redirected to results screen
- [ ] Verify: Teacher sees live update (vote count increases)
- [ ] Backend logs: `Student <id> submitted answer: opt_<id>`

### Test 5: **AUTO-END ON ALL ANSWERED** ⚠️ NEW FIX
- [ ] Teacher creates new poll (as above)
- [ ] Open 3 student windows (incognito/different browsers)
- [ ] Students: Alice, Bob, Charlie
- [ ] All 3 students submit answers
- [ ] **Verify: Poll auto-ends within 1 second after last answer**
- [ ] Backend logs: `All 3 students answered. Ending poll early.`
- [ ] All clients see results immediately
- [ ] **CRITICAL**: Poll ends BEFORE timer expires

### Test 6: Auto-End on Timer ✅
- [ ] Teacher creates poll with 30 second duration
- [ ] 1 student joins but doesn't answer
- [ ] Wait 30 seconds
- [ ] Verify: Poll auto-ends on timeout
- [ ] Backend logs: `Poll <poll_id> ended. Total answers: 0`

### Test 7: Real-Time Results ✅
- [ ] Teacher creates poll
- [ ] Open 3 student windows
- [ ] Students submit answers one by one with 5 second delays
- [ ] Verify: Teacher sees each vote appear instantly
- [ ] Verify: Vote percentages update in real-time
- [ ] Verify: "X/3 students answered" updates live

### Test 8: Multiple Polls ✅
- [ ] Complete a poll
- [ ] Teacher clicks "Ask a new question"
- [ ] Verify: Button only enabled after poll ends
- [ ] Create second poll
- [ ] Verify: Students see new poll automatically
- [ ] Verify: Previous answers reset

### Test 9: Chat (Bonus) ✅
- [ ] Open chat panel (student or teacher)
- [ ] Send message
- [ ] Verify: Appears instantly for all participants
- [ ] Backend logs: `Chat message received`

### Test 10: Edge Cases ✅
- [ ] Student refreshes page mid-poll
- [ ] Verify: Reconnects and sees current poll state
- [ ] Student tries to answer twice
- [ ] Verify: Rejected (button disabled)
- [ ] Teacher tries to create poll while one is active
- [ ] Verify: Previous poll data maintained

---

## Post-Deployment Testing

### After Backend Deployment (Render/Railway)

1. **Health Check**
   ```bash
   curl https://your-backend.onrender.com/health
   ```
   Expected: `{"status":"ok","timestamp":"..."}`

2. **WebSocket Connection**
   - Browser console should show Socket.io connection
   - Check for CORS errors (should be none)

### After Frontend Deployment (Vercel/Netlify)

1. **Environment Variables**
   - Check `VITE_SOCKET_URL` points to deployed backend
   - Check Supabase credentials set

2. **End-to-End Test**
   - Run all 10 tests above on production URLs
   - Test from different networks/devices
   - Verify real-time works across internet

---

## Known Issues to Avoid

### ❌ Common Mistakes

1. **Backend not running**: Frontend shows Socket.io disconnected
   - Fix: Start backend server first

2. **Wrong VITE_SOCKET_URL**: Connection refused errors
   - Fix: Must include `http://` or `https://` prefix

3. **Supabase credentials missing**: Votes not saving
   - Fix: Add service key to `server/.env`

4. **CORS errors in production**: Frontend can't connect to backend
   - Fix: Update `FRONTEND_URL` in backend env vars

5. **WebSocket disabled on host**: Connections fail
   - Fix: Ensure Render/Railway has WebSocket support (they do by default)

---

## Success Criteria

### Before Submitting Assignment

- [ ] All 10 tests pass locally
- [ ] Backend deployed and health check returns 200
- [ ] Frontend deployed and accessible
- [ ] Socket.io connection established in production
- [ ] Poll auto-ends when all students answer ⚠️ **NEW REQUIREMENT**
- [ ] Poll auto-ends on timeout
- [ ] Real-time updates work across internet
- [ ] No console errors
- [ ] Tested on 2+ browsers
- [ ] Deployment URLs documented in submission

---

## Performance Benchmarks

### Expected Latency
- Poll creation → Student receives: **< 100ms**
- Answer submit → Teacher sees update: **< 100ms**
- All answered → Poll ends: **< 2 seconds**
- Timer expires → Poll ends: **< 1 second**

### Expected Behavior
- 10 concurrent students: No lag
- 50 concurrent students: Minimal lag (< 500ms)
- 100+ students: Consider Redis adapter

---

## Debugging Commands

### Check Backend Logs
```bash
# Render: Dashboard → Logs
# Railway: Deployment → Logs
# Local: Terminal output
```

### Check Frontend Logs
```bash
# Browser Console (F12)
# Look for Socket.io connection logs
# Check Network tab → WS (WebSocket frames)
```

### Check Database
```bash
# Supabase Dashboard → Table Editor
# Verify rows in: polls, poll_options, votes, participants
```

---

## Assignment Submission Checklist

Before submitting to Intervue:

- [ ] Code pushed to GitHub
- [ ] README.md updated with deployment URLs
- [ ] Backend deployed (Render/Railway)
- [ ] Frontend deployed (Vercel/Netlify)
- [ ] Live demo works end-to-end
- [ ] Socket.io events verified (see audit report)
- [ ] Auto-end on "all answered" tested ⚠️
- [ ] Auto-end on timeout tested
- [ ] Real-time updates tested
- [ ] Screenshots/video of working demo
- [ ] Deployment URLs in submission form

---

**Status**: ✅ All critical fixes implemented  
**Auto-End Logic**: ✅ Added (all students answered)  
**Ready for Deployment**: ✅ Yes  
**Estimated Deployment Time**: 2-3 hours
