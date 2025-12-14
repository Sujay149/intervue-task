import React, { useEffect, useState } from 'react';

interface ResultBarProps {
  number: number;
  text: string;
  percentage: number;
  delay?: number;
}

const ResultBar: React.FC<ResultBarProps> = ({
  number,
  text,
  percentage,
  delay = 0,
}) => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, delay);
    return () => clearTimeout(timer);
  }, [percentage, delay]);

  return (
    <div className="relative h-14 bg-input rounded-lg overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 bg-primary rounded-lg transition-all duration-700 ease-out flex items-center gap-3 px-4"
        style={{ width: `${Math.max(width, 15)}%` }}
      >
        <span className="w-7 h-7 rounded-full bg-primary-foreground/20 flex items-center justify-center text-sm font-semibold text-primary-foreground">
          {number}
        </span>
        <span className="text-primary-foreground font-medium truncate">{text}</span>
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center">
        <span className="text-foreground font-semibold">{percentage}%</span>
      </div>
    </div>
  );
};

export default ResultBar;
