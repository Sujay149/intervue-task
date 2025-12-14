import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Badge from '@/components/Badge';
import { usePoll } from '@/context/PollContext';
import { ChevronDown, Plus, History } from 'lucide-react';

interface Option {
  text: string;
  isCorrect: boolean;
}

const TeacherCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createPoll, loading, setRole, role } = usePoll();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { text: '', isCorrect: true },
    { text: '', isCorrect: false },
  ]);
  const [duration, setDuration] = useState(60);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  // Set role on mount if not set
  useEffect(() => {
    if (!role) {
      setRole('teacher');
    }
  }, [role, setRole]);

  const handleAddOption = () => {
    if (options.length < 6) {
      setOptions([...options, { text: '', isCorrect: false }]);
    }
  };

  const handleOptionChange = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  const handleCorrectChange = (index: number, isCorrect: boolean) => {
    const newOptions = [...options];
    newOptions[index].isCorrect = isCorrect;
    setOptions(newOptions);
  };

  const handleAskQuestion = async () => {
    if (question.trim() && options.every(opt => opt.text.trim())) {
      await createPoll(question.trim(), options, duration);
      navigate('/teacher/live');
    }
  };

  const isValid = question.trim() && options.every(opt => opt.text.trim());

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Badge />
          <button
            onClick={() => navigate('/teacher/history')}
            className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
          >
            <History className="w-5 h-5" />
            View Poll History
          </button>
        </div>

        <h1 className="text-4xl font-light text-foreground mb-2">
          Let's <span className="font-bold">Get Started</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          you'll have the ability to create and manage polls, ask questions, and monitor your students' responses in real-time.
        </p>

        <div className="flex items-start justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">Enter your question</h2>
          <div className="relative">
            <button
              onClick={() => setShowDurationDropdown(!showDurationDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-foreground"
            >
              {duration} seconds
              <ChevronDown className="w-4 h-4" />
            </button>
            {showDurationDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-10">
                {[30, 45, 60, 90, 120].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => {
                      setDuration(sec);
                      setShowDurationDropdown(false);
                    }}
                    className="block w-full px-4 py-2 text-left hover:bg-muted text-foreground"
                  >
                    {sec} seconds
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8">
          <div className="relative">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value.slice(0, 100))}
              placeholder="Type your question here..."
              className="input-field min-h-[150px] resize-none"
            />
            <span className="absolute bottom-4 right-4 text-muted-foreground text-sm">
              {question.length}/100
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Edit Options</h3>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={option.text}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="input-field flex-1"
                  />
                </div>
              ))}
              <button
                onClick={handleAddOption}
                disabled={options.length >= 6}
                className="btn-ghost text-primary"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add More option
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground mb-4">Is it Correct?</h3>
            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={index} className="flex items-center gap-4 h-[52px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={option.isCorrect}
                      onChange={() => handleCorrectChange(index, true)}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="text-foreground">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`correct-${index}`}
                      checked={!option.isCorrect}
                      onChange={() => handleCorrectChange(index, false)}
                      className="w-5 h-5 accent-primary"
                    />
                    <span className="text-foreground">No</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8 border-t border-border">
          <button
            onClick={handleAskQuestion}
            disabled={!isValid || loading}
            className="btn-primary min-w-[180px]"
          >
            {loading ? 'Creating...' : 'Ask Question'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeacherCreate;
