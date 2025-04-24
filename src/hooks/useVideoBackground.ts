import { useEffect, useRef, useState } from 'react';

interface UseVideoBackgroundProps {
  videoSrc: string;
  /** Duration of the opacity crossfade in milliseconds */
  fadeOverlap?: number;
  /** How many seconds before the video ends to start the transition */
  startTransitionBeforeEnd?: number;
}

export const useVideoBackground = ({
  videoSrc,
  fadeOverlap = 2000, // Longer fade for smoother transition
  startTransitionBeforeEnd = 3 // Start transition earlier
}: UseVideoBackgroundProps) => {
  const [isFirstVideoActive, setIsFirstVideoActive] = useState(true);
  const [opacity1, setOpacity1] = useState(1);
  const [opacity2, setOpacity2] = useState(0);
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    // Initialize videos
    video1.muted = true;
    video2.muted = true;
    video1.loop = true;
    video2.loop = true;
    
    // Start playing the first video
    const playVideo = async () => {
      try {
        await video1.play();
      } catch (err) {
        console.error("Failed to play video:", err);
      }
    };
    
    playVideo();

    const startTransition = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      
      // Get the currently active video and the next one
      const currentVideo = isFirstVideoActive ? video1 : video2;
      const nextVideo = isFirstVideoActive ? video2 : video1;
      
      // Reset the next video position and start playing
      nextVideo.currentTime = 0;
      
      // Gradually adjust opacities for a smoother transition
      let startTime: number | null = null;
      
      const animateTransition = (timestamp: number) => {
        if (startTime === null) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / fadeOverlap, 1);
        
        // Smooth easing function
        const eased = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        
        if (isFirstVideoActive) {
          setOpacity1(1 - eased);
          setOpacity2(eased);
        } else {
          setOpacity1(eased);
          setOpacity2(1 - eased);
        }
        
        if (progress < 1) {
          requestAnimationFrame(animateTransition);
        } else {
          // Transition complete
          setIsFirstVideoActive(!isFirstVideoActive);
          isTransitioningRef.current = false;
        }
      };
      
      // Start the smooth opacity animation
      nextVideo.play()
        .then(() => requestAnimationFrame(animateTransition))
        .catch(err => {
          console.error("Failed to play next video:", err);
          isTransitioningRef.current = false;
        });
    };

    const handleTimeUpdate = () => {
      const currentVideo = isFirstVideoActive ? video1 : video2;
      
      // Check if we're near the end of the video and not already transitioning
      if (!isTransitioningRef.current && 
          currentVideo.duration > 0 && 
          currentVideo.currentTime >= currentVideo.duration - startTransitionBeforeEnd) {
        startTransition();
      }
    };

    video1.addEventListener('timeupdate', handleTimeUpdate);
    video2.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      video1.removeEventListener('timeupdate', handleTimeUpdate);
      video2.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [isFirstVideoActive, startTransitionBeforeEnd, fadeOverlap]);

  return {
    video1Ref,
    video2Ref,
    isFirstVideoActive,
    // Use dynamic opacity values instead of CSS classes
    opacity1,
    opacity2
  };
}; 