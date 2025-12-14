import { Server, Socket } from 'socket.io';
import { supabase } from '../supabaseClient.js';
import {
  pollState,
  resetPollState,
  addStudent,
  removeStudent,
  submitAnswer,
  getStudentsList,
  getCurrentResults,
  type Student,
  type Poll,
} from './pollState.js';

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket: Socket) => {
    console.log(`Client connected: ${socket.id}`);

    // Student joins the poll
    socket.on('student:join', async (data: { studentId: string; name: string; pollId: string }) => {
      const { studentId, name, pollId } = data;
      
      const student: Student = {
        id: studentId,
        socketId: socket.id,
        name,
        hasAnswered: false,
      };
      
      addStudent(student);
      socket.join(`poll:${pollId}`);
      
      // Save participant to Supabase
      await supabase.from('participants').upsert({
        id: studentId,
        poll_id: pollId,
        name,
        joined_at: new Date().toISOString(),
      });
      
      // Send current poll state to joining student
      socket.emit('poll:state', {
        currentPoll: pollState.currentPoll,
        students: getStudentsList(),
      });
      
      // Notify all clients about updated participants
      io.to(`poll:${pollId}`).emit('system:update_participants', {
        students: getStudentsList(),
      });
      
      console.log(`Student ${name} (${studentId}) joined poll ${pollId}`);
    });

    // Student submits answer
    socket.on('student:submit_answer', async (data: { studentId: string; pollId: string; optionId: string }) => {
      const { studentId, pollId, optionId } = data;
      
      const success = submitAnswer(studentId, optionId);
      
      if (!success) {
        socket.emit('error', { message: 'Already answered or not joined' });
        return;
      }
      
      // Save vote to Supabase
      await supabase.from('votes').insert({
        participant_id: studentId,
        poll_id: pollId,
        option_id: optionId,
        voted_at: new Date().toISOString(),
      });
      
      // Broadcast updated results to all clients
      const results = getCurrentResults();
      io.to(`poll:${pollId}`).emit('poll:update_results', {
        results,
        students: getStudentsList(),
      });
      
      console.log(`Student ${studentId} submitted answer: ${optionId}`);
      
      // Check if all students have answered - auto-end poll
      const totalStudents = pollState.students.size;
      const totalAnswers = pollState.answers.size;
      
      if (totalStudents > 0 && totalAnswers === totalStudents) {
        console.log(`All ${totalStudents} students answered. Ending poll early.`);
        // Small delay to ensure last update broadcasts
        setTimeout(() => endPoll(io, pollId), 1000);
      }
    });

    // Teacher starts a poll
    socket.on('teacher:start_poll', async (data: { pollId: string; poll: Poll }) => {
      const { pollId, poll } = data;
      
      resetPollState();
      pollState.currentPoll = poll;
      pollState.pollStartTime = Date.now();
      pollState.timerEnds = Date.now() + poll.duration * 1000;
      
      socket.join(`poll:${pollId}`);
      
      // Save poll to Supabase
      await supabase.from('polls').upsert({
        id: pollId,
        question: poll.question,
        duration: poll.duration,
        is_active: true,
        created_at: new Date(poll.createdAt).toISOString(),
      });
      
      // Save poll options
      for (const option of poll.options) {
        await supabase.from('poll_options').upsert({
          id: option.id,
          poll_id: pollId,
          text: option.text,
          is_correct: option.isCorrect,
        });
      }
      
      // Broadcast poll to all connected clients (including waiting students)
      io.emit('poll:started', {
        poll,
        timerEnds: pollState.timerEnds,
      });
      
      console.log(`Teacher started poll: ${pollId}`);
      
      // Auto-end poll when timer expires
      setTimeout(() => {
        endPoll(io, pollId);
      }, poll.duration * 1000);
    });

    // Teacher manually ends poll
    socket.on('teacher:end_poll', async (data: { pollId: string }) => {
      const { pollId } = data;
      await endPoll(io, pollId);
    });

    // Teacher goes to next question
    socket.on('teacher:next_question', async (data: { pollId: string; poll: Poll }) => {
      const { pollId, poll } = data;
      
      resetPollState();
      pollState.currentPoll = poll;
      pollState.pollStartTime = Date.now();
      pollState.timerEnds = Date.now() + poll.duration * 1000;
      
      // Broadcast new question to all clients
      io.emit('poll:new_question', {
        poll,
        timerEnds: pollState.timerEnds,
      });
      
      console.log(`Teacher started next question for poll: ${pollId}`);
      
      // Auto-end poll when timer expires
      setTimeout(() => {
        endPoll(io, pollId);
      }, poll.duration * 1000);
    });

    // Send chat message
    socket.on('chat:send', async (data: { pollId: string; userId: string; userName: string; text: string }) => {
      const { pollId, userId, userName, text } = data;
      
      const message = {
        id: `${Date.now()}-${Math.random()}`,
        userId,
        userName,
        text,
        timestamp: Date.now(),
      };
      
      // Save to Supabase
      await supabase.from('chat_messages').insert({
        id: message.id,
        poll_id: pollId,
        user_id: userId,
        user_name: userName,
        message: text,
        created_at: new Date().toISOString(),
      });
      
      // Broadcast to all in poll
      io.to(`poll:${pollId}`).emit('chat:message', message);
    });

    // Teacher kicks a student
    socket.on('teacher:kick_student', async (data: { pollId: string; studentId: string }) => {
      const { pollId, studentId } = data;
      
      const student = pollState.students.get(studentId);
      
      if (student) {
        // Mark as kicked in Supabase
        await supabase
          .from('participants')
          .update({ is_kicked: true })
          .eq('id', studentId);
        
        // Notify the kicked student
        io.to(student.socketId).emit('student:kicked');
        
        // Remove from active students
        removeStudent(studentId);
        
        // Notify all about updated participants
        io.to(`poll:${pollId}`).emit('system:update_participants', {
          students: getStudentsList(),
        });
        
        console.log(`Student ${student.name} (${studentId}) was kicked from poll ${pollId}`);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      // Find and remove student by socket ID
      for (const [studentId, student] of pollState.students.entries()) {
        if (student.socketId === socket.id) {
          removeStudent(studentId);
          
          // Notify others
          if (pollState.currentPoll) {
            io.to(`poll:${pollState.currentPoll.id}`).emit('system:update_participants', {
              students: getStudentsList(),
            });
          }
          
          console.log(`Student ${student.name} (${studentId}) disconnected`);
          break;
        }
      }
      
      console.log(`Client disconnected: ${socket.id}`);
    });
  });
}

async function endPoll(io: Server, pollId: string): Promise<void> {
  if (!pollState.currentPoll) return;
  
  const results = getCurrentResults();
  
  // Mark poll as inactive in Supabase
  await supabase.from('polls').update({ is_active: false }).eq('id', pollId);
  
  // Broadcast poll ended with final results
  io.to(`poll:${pollId}`).emit('poll:ended', {
    results,
    students: getStudentsList(),
  });
  
  console.log(`Poll ${pollId} ended. Total answers: ${pollState.answers.size}`);
}
