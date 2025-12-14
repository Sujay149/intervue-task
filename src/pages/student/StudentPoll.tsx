import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '@/components/Timer';
import PollCard from '@/components/PollCard';
import OptionCard from '@/components/OptionCard';
import ChatFab from '@/components/ChatFab';
import { usePoll } from '@/context/PollContext';

const StudentPoll: React.FC = () => {
  const navigate = useNavigate();
  const { state, submitAnswer, hasAnswered, isKicked, loading } = usePoll();
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (isKicked) {
      navigate('/student/kicked');
    }
  }, [isKicked, navigate]);

  useEffect(() => {
    // Redirect to results when poll ends
    if (state.currentPoll && !state.currentPoll.isActive) {
      navigate('/student/results');
      return;
    }
    // Redirect to wait if no poll
    if (!state.currentPoll) {
      navigate('/student/wait');
    }
  }, [state.currentPoll?.isActive, state.currentPoll?.id, navigate]);

  useEffect(() => {
    // Redirect when answered
    if (hasAnswered) {
      navigate('/student/results');
    }
  }, [hasAnswered, navigate]);

  const handleSubmit = async () => {
    if (selected) {
      await submitAnswer(selected);
    }
  };

  if (!state.currentPoll) return null;

  const questionNumber = state.pollHistory.length + 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl animate-fade-in-up">
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-foreground">Question {questionNumber}</h2>
          <Timer seconds={state.timeRemaining} />
        </div>

        <PollCard question={state.currentPoll.question}>
          {state.currentPoll.options.map((option, index) => (
            <OptionCard
              key={option.id}
              number={index + 1}
              text={option.text}
              selected={selected === option.id}
              onClick={() => setSelected(option.id)}
              disabled={hasAnswered || loading}
            />
          ))}
        </PollCard>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleSubmit}
            disabled={!selected || hasAnswered || loading}
            className="btn-primary min-w-[180px]"
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <ChatFab onClick={() => {}} />
    </div>
  );
};

export default StudentPoll;
