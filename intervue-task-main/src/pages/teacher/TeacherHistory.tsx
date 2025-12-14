import React from 'react';
import { useNavigate } from 'react-router-dom';
import PollCard from '@/components/PollCard';
import ResultBar from '@/components/ResultBar';
import ChatFab from '@/components/ChatFab';
import { usePoll } from '@/context/PollContext';
import { ArrowLeft } from 'lucide-react';

const TeacherHistory: React.FC = () => {
  const navigate = useNavigate();
  const { state } = usePoll();

  const allPolls = state.currentPoll 
    ? [...state.pollHistory, state.currentPoll]
    : state.pollHistory;

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/teacher/live')}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Live
        </button>

        <h1 className="text-4xl font-light text-foreground mb-12">
          View <span className="font-bold">Poll History</span>
        </h1>

        {allPolls.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No polls created yet.</p>
          </div>
        ) : (
          <div className="space-y-12">
            {allPolls.map((poll, pollIndex) => {
              const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0);
              
              return (
                <div key={poll.id} className="animate-fade-in-up" style={{ animationDelay: `${pollIndex * 100}ms` }}>
                  <h2 className="text-xl font-bold text-foreground mb-4">
                    Question {pollIndex + 1}
                  </h2>
                  
                  <PollCard question={poll.question}>
                    {poll.options.map((option, index) => {
                      const percentage = totalVotes > 0 
                        ? Math.round((option.votes / totalVotes) * 100) 
                        : 0;
                      return (
                        <ResultBar
                          key={option.id}
                          number={index + 1}
                          text={option.text}
                          percentage={percentage}
                          delay={index * 100}
                        />
                      );
                    })}
                  </PollCard>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ChatFab onClick={() => {}} />
    </div>
  );
};

export default TeacherHistory;
