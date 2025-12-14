import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from '@/components/Timer';
import PollCard from '@/components/PollCard';
import ResultBar from '@/components/ResultBar';
import ChatPanel from '@/components/ChatPanel';
import ChatFab from '@/components/ChatFab';
import { usePoll } from '@/context/PollContext';

const StudentResults: React.FC = () => {
  const navigate = useNavigate();
  const { state, isKicked } = usePoll();
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('chat');

  useEffect(() => {
    if (isKicked) {
      navigate('/student/kicked');
    }
  }, [isKicked, navigate]);

  useEffect(() => {
    // If new poll starts, go back to poll screen
    if (state.currentPoll?.isActive) {
      navigate('/student/poll');
    }
  }, [state.currentPoll?.isActive, navigate]);

  useEffect(() => {
    if (!state.currentPoll) {
      navigate('/student/wait');
    }
  }, [state.currentPoll?.id, navigate]);

  if (!state.currentPoll) return null;

  const totalVotes = state.currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const questionNumber = state.pollHistory.length + 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="flex gap-8">
          <div className="flex-1 animate-fade-in-up">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-foreground">Question {questionNumber}</h2>
              <Timer seconds={state.timeRemaining} />
            </div>

            <PollCard question={state.currentPoll.question}>
              {state.currentPoll.options.map((option, index) => {
                const percentage = totalVotes > 0 
                  ? Math.round((option.votes / totalVotes) * 100) 
                  : 0;
                return (
                  <ResultBar
                    key={option.id}
                    number={index + 1}
                    text={option.text}
                    percentage={percentage}
                    delay={index * 150}
                  />
                );
              })}
            </PollCard>

            <p className="text-center text-xl font-bold text-foreground mt-12">
              Wait for the teacher to ask a new question.
            </p>
          </div>

          {showChat && (
            <ChatPanel activeTab={activeTab} onTabChange={setActiveTab} showKick={false} />
          )}
        </div>
      </div>

      <ChatFab onClick={() => setShowChat(!showChat)} />
    </div>
  );
};

export default StudentResults;
