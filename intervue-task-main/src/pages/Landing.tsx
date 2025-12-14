import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';
import { usePoll } from '@/context/PollContext';
import { cn } from '@/lib/utils';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const { setRole } = usePoll();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      if (selectedRole === 'student') {
        navigate('/student/name');
      } else {
        navigate('/teacher/create');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-3xl text-center animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Badge />
        </div>

        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
          Welcome to the <span className="font-bold">Live Polling System</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-12">
          Please select the role that best describes you to begin using the live polling system
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setSelectedRole('student')}
            className={cn(
              'role-card text-left',
              selectedRole === 'student' && 'selected'
            )}
          >
            <h3 className="text-xl font-bold text-foreground mb-2">I'm a Student</h3>
            <p className="text-muted-foreground">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </button>

          <button
            onClick={() => setSelectedRole('teacher')}
            className={cn(
              'role-card text-left',
              selectedRole === 'teacher' && 'selected'
            )}
          >
            <h3 className="text-xl font-bold text-foreground mb-2">I'm a Teacher</h3>
            <p className="text-muted-foreground">
              Submit answers and view live poll results in real-time.
            </p>
          </button>
        </div>

        <button
          onClick={handleContinue}
          disabled={!selectedRole}
          className="btn-primary min-w-[200px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Landing;
