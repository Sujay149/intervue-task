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
  socketId: string;
  name: string;
  hasAnswered: boolean;
  answerId?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: number;
}

export interface PollState {
  currentPoll: Poll | null;
  students: Map<string, Student>;
  answers: Map<string, string>; // studentId -> optionId
  pollStartTime: number | null;
  timerEnds: number | null;
}

// Server state
export const pollState: PollState = {
  currentPoll: null,
  students: new Map(),
  answers: new Map(),
  pollStartTime: null,
  timerEnds: null,
};

export function resetPollState(): void {
  pollState.currentPoll = null;
  pollState.answers.clear();
  pollState.pollStartTime = null;
  pollState.timerEnds = null;
  // Keep students connected
  pollState.students.forEach((student) => {
    student.hasAnswered = false;
    student.answerId = undefined;
  });
}

export function addStudent(student: Student): void {
  pollState.students.set(student.id, student);
}

export function removeStudent(studentId: string): void {
  pollState.students.delete(studentId);
  pollState.answers.delete(studentId);
}

export function submitAnswer(studentId: string, optionId: string): boolean {
  const student = pollState.students.get(studentId);
  if (!student || student.hasAnswered) {
    return false;
  }
  
  student.hasAnswered = true;
  student.answerId = optionId;
  pollState.answers.set(studentId, optionId);
  
  return true;
}

export function getStudentsList(): Array<Omit<Student, 'socketId'>> {
  return Array.from(pollState.students.values()).map(({ socketId, ...rest }) => rest);
}

export function getCurrentResults(): PollOption[] {
  if (!pollState.currentPoll) return [];
  
  const results = pollState.currentPoll.options.map((opt) => ({
    ...opt,
    votes: 0,
  }));
  
  pollState.answers.forEach((optionId) => {
    const option = results.find((o) => o.id === optionId);
    if (option) option.votes++;
  });
  
  return results;
}
