import React, { useState } from 'react';
import { Task } from './types';

interface Props {
  task: Task;
  onComplete: () => void;
  onDelete: () => void;
  onEdit: (updates: Partial<Task>) => void;
}

const TaskCard: React.FC<Props> = ({ task, onComplete, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const energyColors = {
    high: 'border-amber-400 bg-amber-50',
    medium: 'border-blue-400 bg-blue-50',
    low: 'border-purple-400 bg-purple-50',
  };

  const energyIcons = {
    high: '⚡',
    medium: '🌤',
    low: '🌙',
  };

  const timeDisplay = task.estimatedTime === 'custom' 
    ? `${task.customTime}m` 
    : task.estimatedTime;

  const handleCheckboxClick = () => {
    setIsCompleting(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div
      className={`
        relative bg-white rounded-xl p-5 shadow-sm border-2
        transition-all duration-300
        ${isCompleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
        hover:shadow-md
        ${energyColors[task.energyLevel]}
      `}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={handleCheckboxClick}
          className="shrink-0 w-6 h-6 rounded border-2 border-slate-400 hover:border-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center group"
        >
          <svg 
            className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-50 transition-opacity" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </button>

        {/* Task content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-slate-800 mb-2">
            {task.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
            <span className="flex items-center gap-1">
              {energyIcons[task.energyLevel]}
              {task.energyLevel}
            </span>
            <span className="text-slate-400">•</span>
            <span>⏱ {timeDisplay}</span>
            {task.flexible && (
              <>
                <span className="text-slate-400">•</span>
                <span className="text-blue-600">flexible</span>
              </>
            )}
          </div>

          {task.note && (
            <p className="mt-2 text-sm text-slate-500 line-clamp-2">
              {task.note}
            </p>
          )}
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="text-slate-400 hover:text-slate-600 p-2 transition-colors"
          >
            ⋮
          </button>
          
          {showMenu && (
            <>
              <div 
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 min-w-30">
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;