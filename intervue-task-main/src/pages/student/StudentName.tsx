import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';
import { usePoll } from '@/context/PollContext';

const StudentName: React.FC = () => {
  const navigate = useNavigate();
  const { setStudentName } = usePoll();
  const [name, setName] = useState('');

  const handleContinue = () => {
    if (name.trim()) {
      setStudentName(name.trim());
      navigate('/student/wait');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-xl text-center animate-fade-in-up">
        <div className="flex justify-center mb-8">
          <Badge />
        </div>

        <h1 className="text-4xl md:text-5xl font-light text-foreground mb-4">
          Let's <span className="font-bold">Get Started</span>
        </h1>

        <p className="text-muted-foreground text-lg mb-12">
          If you're a student, you'll be able to <span className="font-semibold text-foreground">submit your answers</span>, participate in live polls, and see how your responses compare with your classmates
        </p>

        <div className="text-left mb-8">
          <label className="block text-foreground font-semibold mb-3">
            Enter your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Bajaj"
            className="input-field"
          />
        </div>

        <button
          onClick={handleContinue}
          disabled={!name.trim()}
          className="btn-primary min-w-[200px]"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StudentName;
