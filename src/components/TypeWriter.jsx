import { useEffect, useState } from 'react';

export default function TypeWriter({
  text = '',
  speed = 60,
  delay = 0,
  className = '',
  cursor = true,
  onComplete,
}) {
  const [displayed, setDisplayed] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (!text) return;
    const timer = setTimeout(() => setHasStarted(true), delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  useEffect(() => {
    if (!hasStarted || !text) return;

    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [hasStarted, text, speed, onComplete]);

  return (
    <span className={className}>
      {displayed}
      {cursor && !isComplete && hasStarted && (
        <span className="inline-block w-[3px] h-[1em] bg-current align-middle ml-1 animate-pulse" />
      )}
    </span>
  );
}
