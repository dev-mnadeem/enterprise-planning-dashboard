import { useMemo } from 'react';

/**
 * Custom hook to memoize a function.
 * @param {Function} fn - The function to memoize.
 * @param {Array} deps - The dependencies array.
 * @returns {Function} - The memoized function.
 */
const useMemoized = (fn, deps) => {
  return useMemo(() => fn, deps);
};

export default useMemoized;
