import React from 'react';
import { Task, UserState, ReminderWindow } from './types';

interface Props {
  tasks: Task[];
  userState: UserState;
  onBack: () => void;
  onClearAll: () => void;
  onExport: () => void;
  onUpdateReminder: (pref: ReminderWindow) => void;
}

const Dashboard: React.FC<Props> = ({
  tasks,
  userState,
  onBack,
  onClearAll,
  onExport,
  onUpdateReminder,
}) => {
  const completedTasks = tasks.filter(t => t.completedAt);
  const activeTasks = tasks.filter(t => !t.completedAt);

  // Group completed tasks by energy level
  const byEnergy = {
    high: completedTasks.filter(t => t.energyLevel === 'high').length,
    medium: completedTasks.filter(t => t.energyLevel === 'medium').length,
    low: completedTasks.filter(t => t.energyLevel === 'low').length,
  };

  // Calculate average completion time
  const completionTimes = completedTasks.map(t => {
    if (t.estimatedTime === 'custom') return t.customTime || 30;
    return { '5m': 5, '15m': 15, '30m': 30 }[t.estimatedTime];
  });
  const avgTime = completionTimes.length > 0
    ? Math.round(completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length)
    : 0;

  // Weekly rhythm (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });

  const dailyCounts = last7Days.map(dayStart => {
    const dayEnd = dayStart + 24 * 60 * 60 * 1000;
    return completedTasks.filter(t => 
      t.completedAt && t.completedAt >= dayStart && t.completedAt < dayEnd
    ).length;
  });

  const maxCount = Math.max(...dailyCounts, 1);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      <h2 className="text-3xl font-light text-slate-800">Insights</h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-3xl font-light text-slate-800 mb-1">
            {completedTasks.length}
          </div>
          <div className="text-sm text-slate-500">Tasks completed</div>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <div className="text-3xl font-light text-slate-800 mb-1">
            {activeTasks.length}
          </div>
          <div className="text-sm text-slate-500">Active tasks</div>
        </div>
      </div>

      {/* Energy Distribution */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          Completed by Energy Level
        </h3>
        <div className="space-y-3">
          {[
            { level: 'high', label: '⚡ High', count: byEnergy.high, color: 'bg-amber-400' },
            { level: 'medium', label: '🌤 Medium', count: byEnergy.medium, color: 'bg-blue-400' },
            { level: 'low', label: '🌙 Low', count: byEnergy.low, color: 'bg-purple-400' },
          ].map(item => {
            const percentage = completedTasks.length > 0
              ? (item.count / completedTasks.length) * 100
              : 0;
            
            return (
              <div key={item.level}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="text-slate-500">{item.count}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Average Time */}
      {avgTime > 0 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            Average Task Duration
          </h3>
          <div className="text-3xl font-light text-slate-800">
            {avgTime} minutes
          </div>
        </div>
      )}

      {/* Weekly Rhythm */}
      {completedTasks.length > 0 && (
        <div className="bg-white rounded-xl p-6 border border-slate-200">
          <h3 className="text-lg font-medium text-slate-800 mb-4">
            Last 7 Days
          </h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {dailyCounts.map((count, i) => {
              const height = (count / maxCount) * 100;
              const date = new Date(last7Days[i]);
              const day = date.toLocaleDateString('en', { weekday: 'short' });
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full relative flex-1 flex items-end">
                    <div
                      className="w-full bg-blue-400 rounded-t transition-all duration-500"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="text-xs text-slate-500">{day}</div>
                  <div className="text-xs font-medium text-slate-700">{count}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reminder Settings */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          Reminder Preference
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Get a gentle in-app nudge if you haven't completed anything recently
        </p>
        <select
          value={userState.reminderPreference}
          onChange={(e) => onUpdateReminder(e.target.value as ReminderWindow)}
          className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
        >
          <option value="none">No reminders</option>
          <option value="morning">Morning (6am - 12pm)</option>
          <option value="afternoon">Afternoon (12pm - 6pm)</option>
          <option value="evening">Evening (6pm - 12am)</option>
        </select>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-xl p-6 border border-slate-200">
        <h3 className="text-lg font-medium text-slate-800 mb-4">
          Data Management
        </h3>
        <div className="space-y-3">
          <button
            onClick={onExport}
            className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            Export data as JSON
          </button>
          <button
            onClick={onClearAll}
            className="w-full px-4 py-3 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors text-left"
          >
            Clear all data
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;