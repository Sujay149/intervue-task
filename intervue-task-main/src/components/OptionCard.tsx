import React from 'react';
import { cn } from '@/lib/utils';

interface OptionCardProps {
  number: number;
  text: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

const OptionCard: React.FC<OptionCardProps> = ({
  number,
  text,
  selected = false,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'option-card w-full text-left',
        selected && 'selected',
        disabled && 'cursor-not-allowed opacity-70'
      )}
    >
      <span className="option-number">{number}</span>
      <span className="text-foreground font-medium">{text}</span>
    </button>
  );
};

export default OptionCard;
