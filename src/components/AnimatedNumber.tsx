import { useEffect, useState } from 'react';
import './animatedNumber.css'; // We'll create this file next

interface AnimatedNumberProps {
  value: number;
}

export const AnimatedNumber = ({ value }: AnimatedNumberProps) => {
  const [prevValue, setPrevValue] = useState(value);
  const isIncreasing = value > prevValue;
  
  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(value);
    }
  }, [value, prevValue]);

  return (
    <div className="animated-number-container">
      <div className={`animated-number-value ${value !== prevValue ? (isIncreasing ? 'slide-up-exit' : 'slide-down-exit') : ''}`}>
        {prevValue}
      </div>
      <div className={`animated-number-value ${value !== prevValue ? (isIncreasing ? 'slide-up-enter' : 'slide-down-enter') : ''}`}>
        {value}
      </div>
    </div>
  );
}; 