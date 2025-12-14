import React from 'react';
import { Sparkles } from 'lucide-react';

interface BadgeProps {
  text?: string;
}

const Badge: React.FC<BadgeProps> = ({ text = 'Intervue Poll' }) => {
  return (
    <div className="badge-primary">
      <Sparkles className="w-4 h-4" />
      <span>{text}</span>
    </div>
  );
};

export default Badge;
