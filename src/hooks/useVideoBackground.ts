import { useEffect, useRef, useState } from 'react';

interface UseVideoBackgroundProps {
  videoSrc: string;
  transitionDuration?: number;
  startTransitionBeforeEnd?: number;
}

export const useVideoBackground = ({
  videoSrc,
  transitionDuration = 2000,
  startTransitionBeforeEnd = 2
}: UseVideoBackgroundProps) => {
  const [isFirstVideoActive, setIsFirstVideoActive] = useState(true);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    // Initialize videos
    video1.muted = true;
    video2.muted = true;
    video1.play();

    const handleTimeUpdate = () => {
      const currentVideo = isFirstVideoActive ? video1 : video2;
      const nextVideo = isFirstVideoActive ? video2 : video1;
      
      if (currentVideo.currentTime >= currentVideo.duration - startTransitionBeforeEnd) {
        nextVideo.currentTime = 0;
        nextVideo.play();
        setIsFirstVideoActive(!isFirstVideoActive);
      }
    };

    video1.addEventListener('timeupdate', handleTimeUpdate);
    video2.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video1.removeEventListener('timeupdate', handleTimeUpdate);
      video2.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isFirstVideoActive, startTransitionBeforeEnd]);

  return {
    video1Ref,
    video2Ref,
    isFirstVideoActive,
    transitionClasses: `absolute min-w-full min-h-full object-cover transition-opacity duration-[${transitionDuration}ms] ease-in-out`
  };
}; 