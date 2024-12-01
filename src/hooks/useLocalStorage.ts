import { SetStateAction, useCallback, useEffect, useState } from "react";

const storageListeners: Record<string, ((newValue: string | null) => void)[]> =
  {};

function addStorageListener(
  key: string,
  listener: (newValue: string | null) => void,
) {
  const list = storageListeners[key] ?? [];
  list.push(listener);
  storageListeners[key] = list;
}

export function fireStorageListeners(key: string, newValue: string | null) {
  for (const listener of storageListeners[key] ?? []) {
    listener(newValue);
  }
}

function useLocalStorage<T extends number | string | boolean>(
  key: string,
  initialValue: T,
): [T, (prev: SetStateAction<T>) => void] {
  // Get from local storage then parse stored json or return initialValue
  const readValue = useCallback((): T => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item
        ? ((typeof initialValue === "boolean"
            ? item === "true"
            : typeof initialValue === "number"
              ? parseInt(item)
              : item) as T)
        : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(readValue);

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (valueOrUpdater: SetStateAction<T>): void => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          valueOrUpdater instanceof Function
            ? valueOrUpdater(readValue())
            : valueOrUpdater;
        const valueString = valueToStore.toString();
        // Save to local storage
        if (typeof window !== "undefined") {
          if (valueToStore === initialValue) {
            window.localStorage.removeItem(key);
          } else {
            window.localStorage.setItem(key, valueString);
          }
          fireStorageListeners(key, valueString);
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [initialValue, key, readValue],
  );

  // Add listener for changes from elsewhere.
  useEffect(() => {
    addStorageListener(key, () => setStoredValue(readValue()));
  }, [key, readValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
