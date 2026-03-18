import { useState, useEffect } from "react";

export type UseDebounceProps = {
    value: string;
    delay?: number;
};

function useDebounce<T>(value : T, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timer to update debouncedValue after the delay
    const timer = setTimeout(() => setDebouncedValue(value), delay);

    // Cleanup: cancel the timer if the value changes before delay finishes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;
