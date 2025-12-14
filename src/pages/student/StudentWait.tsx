import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';
import Spinner from '@/components/Spinner';
import ChatFab from '@/components/ChatFab';
import { usePoll } from '@/context/PollContext';

const StudentWait: React.FC = () => {
  const navigate = useNavigate();
  const { state, isKicked } = usePoll();

  useEffect(() => {
    if (isKicked) {
      navigate('/student/kicked');
    }
  }, [isKicked, navigate]);

  useEffect(() => {
    if (state.currentPoll?.isActive) {
      navigate('/student/poll');
    }
  }, [state.currentPoll?.isActive, state.currentPoll?.id, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Badge />
        </div>

        <div className="flex justify-center mb-8">
          <Spinner size="lg" />
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Wait for the teacher to ask questions..
        </h2>
      </div>

      <ChatFab onClick={() => {}} />
    </div>
  );
};

export default StudentWait;
