import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { socket } from '@/sockets/socket';

export interface PollOption {
  id: string;
  text: string;
  isCorrect: boolean;
  votes: number;
}

export interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  duration: number;
  createdAt: number;
  isActive: boolean;
}

export interface Student {
  id: string;
  name: string;
  hasAnswered: boolean;
  answerId?: string;
}

export interface ChatMessage {
  id: string;
  oderId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export type UserRole = 'student' | 'teacher' | null;

export interface PollState {
  currentPoll: Poll | null;
  pollHistory: Poll[];
  students: Student[];
  chatMessages: ChatMessage[];
  timeRemaining: number;
}

interface PollContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  studentName: string;
  setStudentName: (name: string) => void;
  studentId: string;
  participantId: string | null;
  state: PollState;
  createPoll: (question: string, options: Omit<PollOption, 'id' | 'votes'>[], duration: number) => Promise<void>;
  submitAnswer: (optionId: string) => Promise<void>;
  hasAnswered: boolean;
  selectedAnswer: string | null;
  sendMessage: (text: string) => Promise<void>;
  kickStudent: (participantId: string) => Promise<void>;
  askNewQuestion: () => Promise<void>;
  isKicked: boolean;
  loading: boolean;
  canAskNewQuestion: boolean;
  answeredCount: number;
}

const PollContext = createContext<PollContextType | null>(null);

export const usePoll = () => {
  const context = useContext(PollContext);
  if (!context) {
    throw new Error('usePoll must be used within PollProvider');
  }
  return context;
};

export const PollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>(null);
  const [studentName, setStudentName] = useState('');
  const [studentId] = useState(() => `student_${Math.random().toString(36).substring(2, 9)}`);
  const [participantId, setParticipantId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isKicked, setIsKicked] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [state, setState] = useState<PollState>({
    currentPoll: null,
    pollHistory: [],
    students: [],
    chatMessages: [],
    timeRemaining: 0,
  });

  // Fetch poll history from Supabase (persistence only)
  const fetchPollHistory = useCallback(async () => {
    const { data: polls } = await supabase
      .from('polls')
      .select('*')
      .eq('is_active', false)
      .order('created_at', { ascending: true });

    if (polls) {
      const historyWithOptions = await Promise.all(
        polls.map(async (poll) => {
          const { data: options } = await supabase
            .from('poll_options')
            .select('*')
            .eq('poll_id', poll.id)
            .order('option_index', { ascending: true });

          const { data: votes } = await supabase
            .from('votes')
            .select('option_id')
            .eq('poll_id', poll.id);

          return {
            id: poll.id,
            question: poll.question,
            options: (options || []).map(opt => ({
              id: opt.id,
              text: opt.text,
              isCorrect: opt.is_correct,
              votes: votes?.filter(v => v.option_id === opt.id).length || 0,
            })),
            duration: poll.duration,
            createdAt: new Date(poll.created_at).getTime(),
            isActive: false,
          };
        })
      );

      setState(prev => ({ ...prev, pollHistory: historyWithOptions }));
    }
  }, []);

  // Socket.io event handlers setup
  useEffect(() => {
    // Initial fetch of poll history
    fetchPollHistory();

    // Listen for poll state updates (when joining)
    socket.on('poll:state', (data: { currentPoll: Poll | null; students: Student[] }) => {
      if (data.currentPoll) {
        const elapsed = Math.floor((Date.now() - data.currentPoll.createdAt) / 1000);
        const remaining = Math.max(0, data.currentPoll.duration - elapsed);
        
        setState(prev => ({
          ...prev,
          currentPoll: data.currentPoll,
          students: data.students,
          timeRemaining: remaining,
        }));
      }
    });

    // Listen for poll started event
    socket.on('poll:started', (data: { poll: Poll; timerEnds: number }) => {
      const remaining = Math.max(0, Math.floor((data.timerEnds - Date.now()) / 1000));
      
      setState(prev => ({
        ...prev,
        currentPoll: data.poll,
        timeRemaining: remaining,
      }));
      
      setHasAnswered(false);
      setSelectedAnswer(null);
    });

    // Listen for new question event
    socket.on('poll:new_question', (data: { poll: Poll; timerEnds: number }) => {
      const remaining = Math.max(0, Math.floor((data.timerEnds - Date.now()) / 1000));
      
      setState(prev => ({
        ...prev,
        currentPoll: data.poll,
        timeRemaining: remaining,
      }));
      
      setHasAnswered(false);
      setSelectedAnswer(null);
    });

    // Listen for results updates
    socket.on('poll:update_results', (data: { results: PollOption[]; students: Student[] }) => {
      setState(prev => ({
        ...prev,
        currentPoll: prev.currentPoll ? {
          ...prev.currentPoll,
          options: data.results,
        } : null,
        students: data.students,
      }));
    });

    // Listen for poll ended event
    socket.on('poll:ended', (data: { results: PollOption[]; students: Student[] }) => {
      setState(prev => ({
        ...prev,
        currentPoll: prev.currentPoll ? {
          ...prev.currentPoll,
          options: data.results,
          isActive: false,
        } : null,
        students: data.students,
        timeRemaining: 0,
      }));
      
      // Refresh poll history
      fetchPollHistory();
    });

    // Listen for participants updates
    socket.on('system:update_participants', (data: { students: Student[] }) => {
      setState(prev => ({
        ...prev,
        students: data.students,
      }));
    });

    // Listen for chat messages
    socket.on('chat:message', (message: ChatMessage) => {
      setState(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, message],
      }));
    });

    // Listen for kicked event (student only)
    socket.on('student:kicked', () => {
      setIsKicked(true);
    });

    return () => {
      socket.off('poll:state');
      socket.off('poll:started');
      socket.off('poll:new_question');
      socket.off('poll:update_results');
      socket.off('poll:ended');
      socket.off('system:update_participants');
      socket.off('chat:message');
      socket.off('student:kicked');
    };
  }, [fetchPollHistory]);

  // Student joins poll via Socket.io (only once on mount or when poll changes)
  const hasJoinedRef = useRef<string | null>(null);
  
  useEffect(() => {
    if (role === 'student' && studentName) {
      // Join with current poll ID or 'waiting' room
      const pollId = state.currentPoll?.id || 'waiting';
      
      // Only join if we haven't joined this poll yet
      if (hasJoinedRef.current !== pollId) {
        socket.emit('student:join', {
          studentId,
          name: studentName,
          pollId,
        });
        setParticipantId(studentId);
        hasJoinedRef.current = pollId;
      }
    }
  }, [role, studentName, studentId, state.currentPoll?.id]);

  // Timer logic
  useEffect(() => {
    if (state.currentPoll?.isActive && state.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            return {
              ...prev,
              timeRemaining: 0,
            };
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.currentPoll?.id, state.currentPoll?.isActive, state.timeRemaining]);

  const createPoll = useCallback(async (
    question: string, 
    options: Omit<PollOption, 'id' | 'votes'>[], 
    duration: number
  ) => {
    setLoading(true);
    
    const pollId = `poll_${Date.now()}`;
    const poll: Poll = {
      id: pollId,
      question,
      options: options.map((opt, index) => ({
        id: `opt_${index}_${Date.now()}`,
        text: opt.text,
        isCorrect: opt.isCorrect,
        votes: 0,
      })),
      duration,
      createdAt: Date.now(),
      isActive: true,
    };

    // Emit poll start event via Socket.io
    socket.emit('teacher:start_poll', { pollId, poll });

    setHasAnswered(false);
    setSelectedAnswer(null);
    setLoading(false);
  }, []);

  const submitAnswer = useCallback(async (optionId: string) => {
    if (hasAnswered || !state.currentPoll) return;

    // Emit answer via Socket.io
    socket.emit('student:submit_answer', {
      studentId,
      pollId: state.currentPoll.id,
      optionId,
    });

    setHasAnswered(true);
    setSelectedAnswer(optionId);
  }, [hasAnswered, studentId, state.currentPoll]);

  const sendMessage = useCallback(async (text: string) => {
    if (!state.currentPoll) return;

    socket.emit('chat:send', {
      pollId: state.currentPoll.id,
      userId: studentId,
      userName: role === 'teacher' ? 'Teacher' : studentName,
      text,
    });
  }, [state.currentPoll, studentId, studentName, role]);

  const kickStudent = useCallback(async (participantIdToKick: string) => {
    if (!state.currentPoll) return;
    
    // Emit to server
    socket.emit('teacher:kick_student', {
      pollId: state.currentPoll.id,
      studentId: participantIdToKick,
    });
    
    // Update local state
    setState(prev => ({
      ...prev,
      students: prev.students.filter(s => s.id !== participantIdToKick),
    }));
  }, [state.currentPoll]);

  const askNewQuestion = useCallback(async () => {
    // Teacher ends current poll manually
    if (state.currentPoll) {
      socket.emit('teacher:end_poll', { pollId: state.currentPoll.id });
    }
    
    setHasAnswered(false);
    setSelectedAnswer(null);
  }, [state.currentPoll]);

  // Calculate if teacher can ask a new question
  const answeredCount = state.students.filter(s => s.hasAnswered).length;
  const totalStudents = state.students.length;
  const canAskNewQuestion = !state.currentPoll || 
    !state.currentPoll.isActive || 
    (totalStudents > 0 && answeredCount === totalStudents);

  return (
    <PollContext.Provider
      value={{
        role,
        setRole,
        studentName,
        setStudentName,
        studentId,
        participantId,
        state,
        createPoll,
        submitAnswer,
        hasAnswered,
        selectedAnswer,
        sendMessage,
        kickStudent,
        askNewQuestion,
        isKicked,
        loading,
        canAskNewQuestion,
        answeredCount,
      }}
    >
      {children}
    </PollContext.Provider>
  );
};
