/**
 * useFirstVisit - detects whether this is the visitor's first time in the app
 */

import { useEffect, useState } from 'react';

const STORAGE_KEY = 'mx-simulator:has-visited';

export const useFirstVisit = (): boolean => {
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setIsFirstVisit(true);
        localStorage.setItem(STORAGE_KEY, 'true');
      }
    } catch {
      // localStorage unavailable (private browsing, disabled storage) — treat as returning visitor
    }
  }, []);

  return isFirstVisit;
};
