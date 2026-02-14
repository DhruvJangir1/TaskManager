import React from 'react';
import { Task, EnergyLevel } from './types';
import TaskCard from './TaskCard';

interface Props {
  tasks: Task[];
  currentEnergy: EnergyLevel;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onEdit: (taskId: string, updates: Partial<Task>) => void;
  onCreateNew: () => void;
  onChangeEnergy: () => void;
}

const TaskList: React.FC<Props> = ({
  tasks,
  currentEnergy,
  onComplete,
  onDelete,
  onEdit,
  onCreateNew,
  onChangeEnergy,
}) => {
  const energyLabels = {
    high: '⚡ High Energy',
    medium: '🌤 Medium Energy',
    low: '🌙 Low Energy',
  };

  // Filter tasks based on current energy
  // Include exact matches and flexible tasks from adjacent energy levels
  const getEnergyRank = (energy: EnergyLevel): number => {
    return { high: 3, medium: 2, low: 1 }[energy];
  };

  const matchingTasks = tasks.filter(task => {
    if (task.energyLevel === currentEnergy) return true;
    
    if (task.flexible) {
      const currentRank = getEnergyRank(currentEnergy);
      const taskRank = getEnergyRank(task.energyLevel);
      return Math.abs(currentRank - taskRank) === 1;
    }
    
    return false;
  });

  // Sort by estimated time (shortest first), then by creation date
  const timeValues = { '5m': 5, '15m': 15, '30m': 30, 'custom': 999 };
  
  const sortedTasks = [...matchingTasks].sort((a, b) => {
    const timeA = a.estimatedTime === 'custom' ? (a.customTime || 30) : timeValues[a.estimatedTime];
    const timeB = b.estimatedTime === 'custom' ? (b.customTime || 30) : timeValues[b.estimatedTime];
    
    if (timeA !== timeB) return timeA - timeB;
    return a.createdAt - b.createdAt;
  });

  // Limit to 5 tasks to avoid overwhelm
  const displayTasks = sortedTasks.slice(0, 5);
  const hiddenCount = sortedTasks.length - displayTasks.length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-light text-slate-800">
            {energyLabels[currentEnergy]}
          </h2>
          <button
            onClick={onChangeEnergy}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            Change
          </button>
        </div>
        <p className="text-slate-500 text-sm">
          {displayTasks.length === 0 
            ? "No tasks match this energy level" 
            : "Start small. Momentum builds."}
        </p>
      </div>

      {/* Task cards */}
      {displayTasks.length > 0 ? (
        <div className="space-y-4">
          {displayTasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onComplete={() => onComplete(task.id)}
              onDelete={() => onDelete(task.id)}
              onEdit={(updates) => onEdit(task.id, updates)}
            />
          ))}
          
          {hiddenCount > 0 && (
            <div className="text-center py-4 text-sm text-slate-500">
              + {hiddenCount} more task{hiddenCount > 1 ? 's' : ''} available after these
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
          <p className="text-slate-500 mb-4">
            No tasks yet for this energy level
          </p>
          <button
            onClick={onCreateNew}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Create your first task →
          </button>
        </div>
      )}

      {/* Action buttons - FIXED WITH INLINE STYLE */}
      <div className="flex gap-3">
        <button
          onClick={onCreateNew}
          style={{
            background: 'linear-gradient(to right, #3b82f6, #06b6d4)'
          }}
          className="flex-1 px-6 py-4 rounded-xl text-white font-medium hover:shadow-lg transition-all"
        >
          + New Task
        </button>
      </div>

      {/* Stats summary */}
      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-2xl font-light text-slate-800">{tasks.length}</div>
            <div className="text-xs text-slate-500">Active</div>
          </div>
          <div className="w-px bg-slate-300" />
          <div>
            <div className="text-2xl font-light text-slate-800">{displayTasks.length}</div>
            <div className="text-xs text-slate-500">Showing</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskList;