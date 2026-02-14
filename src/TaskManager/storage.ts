// LocalStorage management for EnergiFlow

import { AppData, UserState } from './types';

const STORAGE_KEY = 'energiflow_data';

const defaultUserState: UserState = {
  lastActivityAt: Date.now(),
  reminderPreference: 'none',
};

export const loadData = (): AppData => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load data:', error);
  }
  
  return {
    tasks: [],
    userState: defaultUserState,
  };
};

export const saveData = (data: AppData): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const clearAllData = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const exportData = (): string => {
  const data = loadData();
  return JSON.stringify(data, null, 2);
};