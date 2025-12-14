import React from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';

const StudentKicked: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Badge />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
          You've been Kicked out !
        </h1>

        <p className="text-muted-foreground text-lg max-w-md mx-auto">
          Looks like the teacher had removed you from the poll system. Please Try again sometime.
        </p>
      </div>
    </div>
  );
};

export default StudentKicked;
