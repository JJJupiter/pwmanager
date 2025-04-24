import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const triggerConfetti = (x: number, y: number) => {
    confetti({
      particleCount: 30,
      spread: 50,
      startVelocity: 20,
      gravity: 0.7,
      scalar: 0.7,
      origin: {
        x: x / window.innerWidth,
        y: y / window.innerHeight
      },
      colors: ['#4F46E5', '#2563EB', '#3B82F6', '#60A5FA', '#93C5FD'],
      ticks: 100,
      shapes: ['circle'],
      zIndex: 9999,
    });
  };

  return { triggerConfetti };
}; 