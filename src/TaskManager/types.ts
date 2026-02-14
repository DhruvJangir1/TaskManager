// Core type definitions for EnergiFlow

export type EnergyLevel = 'high' | 'medium' | 'low';
export type TimeEstimate = '5m' | '15m' | '30m' | 'custom';
export type ReminderWindow = 'morning' | 'afternoon' | 'evening' | 'none';

export interface Task {
  id: string;
  title: string;
  energyLevel: EnergyLevel;
  estimatedTime: TimeEstimate;
  customTime?: number; // minutes if custom
  note?: string;
  flexible: boolean; // Can appear in nearby energy levels
  createdAt: number;
  completedAt?: number;
}

export interface UserState {
  currentEnergy?: EnergyLevel;
  lastActivityAt: number;
  reminderPreference: ReminderWindow;
  lastReminderShown?: number;
}

export interface AppData {
  tasks: Task[];
  userState: UserState;
}