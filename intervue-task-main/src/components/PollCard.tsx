import React from 'react';

interface PollCardProps {
  question: string;
  children: React.ReactNode;
}

const PollCard: React.FC<PollCardProps> = ({ question, children }) => {
  return (
    <div className="card-poll w-full max-w-2xl">
      <div className="card-poll-header">
        <p className="text-lg font-medium">{question}</p>
      </div>
      <div className="card-poll-body space-y-3">
        {children}
      </div>
    </div>
  );
};

export default PollCard;
