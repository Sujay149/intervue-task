import React, { useState } from 'react';
import { usePoll } from '@/context/PollContext';
import { Send } from 'lucide-react';

interface ChatPanelProps {
  activeTab: 'chat' | 'participants';
  onTabChange: (tab: 'chat' | 'participants') => void;
  showKick?: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ activeTab, onTabChange, showKick = true }) => {
  const { state, sendMessage, kickStudent, participantId } = usePoll();
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (message.trim()) {
      await sendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <div className="w-80 bg-card border border-border rounded-xl shadow-lg overflow-hidden flex-shrink-0">
      <div className="flex border-b border-border">
        <button
          onClick={() => onTabChange('chat')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'chat'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => onTabChange('participants')}
          className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
            activeTab === 'participants'
              ? 'text-foreground border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Participants
        </button>
      </div>

      <div className="h-80 overflow-y-auto">
        {activeTab === 'chat' ? (
          <div className="p-4 space-y-4">
            {state.chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.oderId === participantId ? 'items-end' : 'items-start'}`}
              >
                <span className="text-xs text-primary font-medium mb-1">{msg.userName}</span>
                <div className={`chat-bubble ${msg.oderId === participantId ? 'outgoing' : 'incoming'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {state.chatMessages.length === 0 && (
              <p className="text-muted-foreground text-sm text-center py-8">No messages yet</p>
            )}
          </div>
        ) : (
          <div className="p-4">
            {showKick && (
              <div className="flex justify-between text-xs text-muted-foreground font-medium mb-3">
                <span>Name</span>
                <span>Action</span>
              </div>
            )}
            {!showKick && (
              <div className="text-xs text-muted-foreground font-medium mb-3">
                <span>Name</span>
              </div>
            )}
            <div className="space-y-2">
              {state.students.map((student) => (
                <div key={student.id} className="flex justify-between items-center py-2">
                  <span className="font-medium text-foreground">{student.name}</span>
                  {showKick && (
                    <button
                      onClick={() => kickStudent(student.id)}
                      className="text-primary text-sm hover:underline"
                    >
                      Kick out
                    </button>
                  )}
                </div>
              ))}
              {state.students.length === 0 && (
                <p className="text-muted-foreground text-sm text-center py-8">No participants yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {activeTab === 'chat' && (
        <div className="p-3 border-t border-border flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 bg-input rounded-lg text-sm focus:outline-none"
          />
          <button
            onClick={handleSend}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatPanel;
