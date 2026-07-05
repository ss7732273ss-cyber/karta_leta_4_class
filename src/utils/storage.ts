import { AppState } from '../types/reading';

const STORAGE_KEY = 'summerReadingMap:v1';

const DEFAULT_STATE: AppState = {
  entries: {},
  childName: '',
};

export const loadState = (): AppState => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_STATE;
    const parsed = JSON.parse(data);
    return {
      entries: parsed.entries || {},
      childName: parsed.childName || '',
    };
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
    return DEFAULT_STATE;
  }
};

export const saveState = (state: AppState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
};

export const clearLocalStorageState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear state in localStorage:', e);
  }
};
