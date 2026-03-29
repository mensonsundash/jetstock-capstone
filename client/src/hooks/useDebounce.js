import { useEffect, useState } from "react";

// Reusable debounce hook
// It delays updating the returned value until the user stops changing the input
// Useful for search fields so API calls do not happen on every keystroke
const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer whenever the input value changes
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear previous timer if user types again before delay finishes
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
