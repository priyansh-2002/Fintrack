import { useEffect, useState } from 'react';

export const useSimulatedLoading = (delay = 650): boolean => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => window.clearTimeout(timeoutId);
  }, [delay]);

  return isLoading;
};
