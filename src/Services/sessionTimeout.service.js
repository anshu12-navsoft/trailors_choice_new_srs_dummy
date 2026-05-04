import { useEffect, useRef, useCallback } from 'react';
import { AppState, PanResponder } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const LAST_ACTIVE_KEY = 'SESSION_LAST_ACTIVE';

/**
 * Tracks user inactivity and calls onExpire after TIMEOUT_MS of no touches.
 * Also checks elapsed time when the app returns from background.
 *
 * Returns panHandlers — spread onto the root View.
 * Only runs when enabled === true.
 */
export function useSessionTimeout({ enabled, onExpire }) {
  const timerRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  const enabledRef = useRef(enabled);

  // keep refs in sync without re-creating callbacks
  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);
  useEffect(() => { enabledRef.current = enabled; }, [enabled]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback((delay = TIMEOUT_MS) => {
    clearTimer();
    timerRef.current = setTimeout(() => {
      if (enabledRef.current) onExpireRef.current?.();
    }, delay);
  }, [clearTimer]);

  // Called on every touch — persists timestamp and resets the countdown
  const recordActivity = useCallback(async () => {
    if (!enabledRef.current) return;
    try {
      await AsyncStorage.setItem(LAST_ACTIVE_KEY, String(Date.now()));
    } catch (_) {}
    startTimer();
  }, [startTimer]);

  // Called when app returns to foreground — computes exact remaining time
  const checkOnForeground = useCallback(async () => {
    if (!enabledRef.current) return;
    try {
      const raw = await AsyncStorage.getItem(LAST_ACTIVE_KEY);
      if (!raw) return;
      const elapsed = Date.now() - Number(raw);
      if (elapsed >= TIMEOUT_MS) {
        onExpireRef.current?.();
      } else {
        startTimer(TIMEOUT_MS - elapsed);
      }
    } catch (_) {}
  }, [startTimer]);

  // Start / stop based on login state
  useEffect(() => {
    if (!enabled) {
      clearTimer();
      AsyncStorage.removeItem(LAST_ACTIVE_KEY).catch(() => {});
      return;
    }

    recordActivity(); // begin timer on login

    const sub = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        checkOnForeground();
      } else {
        // going to background — timer is unreliable in bg, AsyncStorage persists the timestamp
        clearTimer();
      }
    });

    return () => {
      sub.remove();
      clearTimer();
    };
  }, [enabled]); // eslint-disable-line react-hooks/exhaustive-deps

  // PanResponder created once — capture phase fires on every touch without blocking children
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        recordActivity();
        return false; // don't capture; let touch pass through to children
      },
    }),
  ).current;

  return panResponder.panHandlers;
}
