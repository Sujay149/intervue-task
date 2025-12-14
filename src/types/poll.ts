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
