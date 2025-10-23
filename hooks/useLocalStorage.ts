import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  getStorageValue,
  setStorageValue,
  deleteStorageValue,
} from '../api/apiClient';

/**
 * Remote persistence hook that mirrors the previous localStorage behaviour
 * while persisting all values on the backend via REST endpoints.
 */
export const useLocalStorage = <T,>(
  key: string,
  defaultValue: T
): [T, Dispatch<SetStateAction<T>>, () => Promise<void>] => {
  const [value, internalSetValue] = useState<T>(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);
  const keyRef = useRef(key);
  const defaultRef = useRef(defaultValue);

  useEffect(() => {
    keyRef.current = key;
  }, [key]);

  useEffect(() => {
    defaultRef.current = defaultValue;
  }, [defaultValue]);

  useEffect(() => {
    let isActive = true;
    (async () => {
      try {
        const remoteValue = await getStorageValue<T>(key, defaultValue);
        if (isActive) {
          internalSetValue(remoteValue);
        }
      } catch (error) {
        console.error(`Failed to load remote value for key ${key}:`, error);
      } finally {
        if (isActive) {
          setIsLoaded(true);
        }
      }
    })();
    return () => {
      isActive = false;
    };
  }, [key, defaultValue]);

  const persistValue = useCallback(async (nextValue: T) => {
    try {
      await setStorageValue<T>(keyRef.current, nextValue);
    } catch (error) {
      console.error(
        `Failed to persist value for key ${keyRef.current}:`,
        error
      );
    }
  }, []);

  const setValue: Dispatch<SetStateAction<T>> = useCallback(
    (updater) => {
      internalSetValue((prev) => {
        const computedValue =
          typeof updater === 'function'
            ? (updater as (prevState: T) => T)(prev)
            : updater;
        void persistValue(computedValue);
        return computedValue;
      });
    },
    [persistValue]
  );

  useEffect(() => {
    if (!isLoaded) {
      return;
    }
    void persistValue(value);
  }, [value, isLoaded, persistValue]);

  const clearValue = useCallback(async () => {
    try {
      await deleteStorageValue(keyRef.current);
    } catch (error) {
      console.error(
        `Failed to delete remote value for key ${keyRef.current}:`,
        error
      );
    } finally {
      internalSetValue(defaultRef.current);
    }
  }, []);

  return [value, setValue, clearValue];
};
