import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PollCard from '@/components/PollCard';
import ResultBar from '@/components/ResultBar';
import ChatPanel from '@/components/ChatPanel';
import ChatFab from '@/components/ChatFab';
import { usePoll } from '@/context/PollContext';
import { Eye, Download } from 'lucide-react';

const TeacherLive: React.FC = () => {
  const navigate = useNavigate();
  const { state, askNewQuestion, canAskNewQuestion, answeredCount } = usePoll();
  const [showChat, setShowChat] = useState(true);
  const [activeTab, setActiveTab] = useState<'chat' | 'participants'>('participants');

  const handleAskNewQuestion = async () => {
    await askNewQuestion();
    navigate('/teacher/create');
  };

  const handleViewHistory = () => {
    navigate('/teacher/history');
  };

  const handleExportAttendance = () => {
    if (!state.currentPoll) return;

    // Prepare CSV data
    const headers = ['Student Name', 'Status', 'Answer Given', 'Option Selected'];
    const rows = state.students.map(student => {
      const selectedOption = student.answerId 
        ? state.currentPoll?.options.find(opt => opt.id === student.answerId)?.text || 'N/A'
        : 'N/A';
      
      return [
        student.name,
        student.hasAnswered ? 'Answered' : 'Not Answered',
        student.hasAnswered ? 'Yes' : 'No',
        selectedOption
      ];
    });

    // Create CSV content
    const csvContent = [
      `Poll Question: "${state.currentPoll.question}"`,
      `Total Students: ${state.students.length}`,
      `Answered: ${answeredCount}`,
      `Date: ${new Date().toLocaleString()}`,
      '', // Empty line
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `attendance_report_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!state.currentPoll) {
      navigate('/teacher/create');
    }
  }, [state.currentPoll, navigate]);

  // Auto-redirect to create screen when poll ends
  useEffect(() => {
    if (state.currentPoll && !state.currentPoll.isActive) {
      // Poll has ended - wait 2 seconds to show final results, then redirect
      const timer = setTimeout(() => {
        navigate('/teacher/create');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [state.currentPoll?.isActive, navigate]);

  if (!state.currentPoll) return null;

  const totalVotes = state.currentPoll.options.reduce((sum, opt) => sum + opt.votes, 0);
  const totalStudents = state.students.length;
  
  // Get students who answered each option
  const getStudentsForOption = (optionId: string) => {
    return state.students.filter(s => s.hasAnswered && s.answerId === optionId);
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{totalStudents}</span> students connected • 
            <span className="font-semibold text-foreground ml-1">{answeredCount}</span> answered
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleExportAttendance}
              disabled={totalStudents === 0}
              className="flex items-center gap-2 px-6 py-3 bg-green-500/10 text-green-600 rounded-full font-medium hover:bg-green-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              Export Attendance
            </button>
            <button
              onClick={handleViewHistory}
              className="flex items-center gap-2 px-6 py-3 bg-primary/10 text-primary rounded-full font-medium hover:bg-primary/20 transition-colors"
            >
              <Eye className="w-5 h-5" />
              View Poll history
            </button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-foreground mb-6">Question</h2>
            
            <PollCard question={state.currentPoll.question}>
              {state.currentPoll.options.map((option, index) => {
                const percentage = totalVotes > 0 
                  ? Math.round((option.votes / totalVotes) * 100) 
                  : 0;
                const studentsForOption = getStudentsForOption(option.id);
                return (
                  <div key={option.id} className="mb-4">
                    <ResultBar
                      number={index + 1}
                      text={option.text}
                      percentage={percentage}
                      delay={index * 150}
                    />
                    {studentsForOption.length > 0 && (
                      <div className="mt-2 ml-12 text-xs text-muted-foreground">
                        {studentsForOption.map(s => s.name).join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </PollCard>

            <div className="flex flex-col items-center gap-2 mt-8">
              {totalStudents > 0 && (
                <p className="text-sm text-muted-foreground">
                  {answeredCount}/{totalStudents} students answered
                </p>
              )}
              {!state.currentPoll.isActive ? (
                <div className="text-center">
                  <p className="text-lg font-semibold text-primary mb-2">
                    Poll Ended!
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Redirecting to create new poll...
                  </p>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleAskNewQuestion}
                    disabled={!canAskNewQuestion}
                    className="btn-primary min-w-[220px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    + Ask a new question
                  </button>
                  {!canAskNewQuestion && totalStudents > 0 && (
                    <p className="text-xs text-muted-foreground">
                      Wait for all students to answer or for poll to end
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {showChat && (
            <ChatPanel activeTab={activeTab} onTabChange={setActiveTab} showKick={true} />
          )}
        </div>
      </div>

      {!showChat && <ChatFab onClick={() => setShowChat(true)} />}
    </div>
  );
};

export default TeacherLive;
