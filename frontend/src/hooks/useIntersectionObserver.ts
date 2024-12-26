import { useEffect, RefObject } from 'react';

interface UseIntersectionObserverProps {
  target: RefObject<HTMLElement | null>;
  onIntersect: () => void;
  enabled?: boolean;
  rootMargin?: string;
  threshold?: number;
}

export function useIntersectionObserver({
  target,
  onIntersect,
  enabled = true,
  rootMargin = '0px',
  threshold = 0,
}: UseIntersectionObserverProps) {
  useEffect(() => {
    if (!enabled || !target.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onIntersect();
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(target.current);

    return () => {
      if (target.current) {
        observer.unobserve(target.current);
      }
    };
  }, [target, enabled, rootMargin, threshold, onIntersect]);
} 