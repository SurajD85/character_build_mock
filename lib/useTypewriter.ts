import { useEffect, useState, useRef } from "react";

/**
 * Types out text character by character, resetting cleanly when text changes.
 * Uses no plugins — pure React with setInterval.
 */
export function useTypewriter(text: string | undefined, msPerChar = 32): string {
  const [displayed, setDisplayed] = useState("");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const iRef = useRef(0);

  useEffect(() => {
    // Clear previous interval
    if (intervalRef.current) clearInterval(intervalRef.current);
    iRef.current = 0;
    setDisplayed("");

    if (!text) return;

    // If text is short, type it out faster
    const speed = text.length < 20 ? msPerChar : Math.max(msPerChar * 0.7, 22);

    intervalRef.current = setInterval(() => {
      iRef.current += 1;
      setDisplayed(text.slice(0, iRef.current));
      if (iRef.current >= text.length) {
        clearInterval(intervalRef.current!);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, msPerChar]);

  return displayed;
}
