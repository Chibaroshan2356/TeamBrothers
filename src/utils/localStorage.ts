// Safe localStorage utilities with error handling

export const safeGetItem = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    return item === 'undefined' ? null : item;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return null;
  }
};

export const safeParseJSON = <T>(key: string, defaultValue: T): T => {
  const item = safeGetItem(key);
  
  if (!item) {
    return defaultValue;
  }
  
  try {
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error parsing JSON for ${key}:`, error);
    // Clear the corrupted item
    safeRemoveItem(key);
    return defaultValue;
  }
};

export const safeSetItem = (key: string, value: any): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
  }
};

export const safeRemoveItem = (key: string): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};

// Clear all corrupted localStorage items
export const clearCorruptedStorage = (): void => {
  const keysToCheck = ['user', 'bookings', 'compareVehicles', 'isAuthenticated', 'isAdmin'];
  
  keysToCheck.forEach(key => {
    const item = safeGetItem(key);
    if (item && item === 'undefined') {
      safeRemoveItem(key);
      console.log(`Cleared corrupted localStorage item: ${key}`);
    }
  });
};
