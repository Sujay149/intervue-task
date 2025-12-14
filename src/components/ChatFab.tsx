import React from 'react';
import { MessageSquare } from 'lucide-react';

interface ChatFabProps {
  onClick: () => void;
}

const ChatFab: React.FC<ChatFabProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="fab">
      <MessageSquare className="w-6 h-6" />
    </button>
  );
};

export default ChatFab;
