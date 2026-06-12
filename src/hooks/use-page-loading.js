import { useEffect, useState } from "react";

export function usePageLoading(dependencies = [], delay = 700) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);

    const timeoutId = window.setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [delay, ...dependencies]);

  return isLoading;
}
