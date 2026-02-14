import React from 'react';
import { EnergyLevel, Task } from './types';

interface Props {
  onSelect: (energy: EnergyLevel) => void;
  tasks?: Task[];
}

const EnergySelector: React.FC<Props> = ({ onSelect, tasks = [] }) => {
  // Count tasks for each energy level
  const getTaskCount = (level: EnergyLevel): number => {
    return tasks.filter(task => task.energyLevel === level).length;
  };

  const options = [
    {
      level: 'high' as EnergyLevel,
      icon: '⚡',
      label: 'High Energy',
      description: 'Deep work, complex problems',
      color: 'from-amber-400 to-orange-500',
      hoverColor: 'hover:shadow-amber-200',
    },
    {
      level: 'medium' as EnergyLevel,
      icon: '🌤',
      label: 'Medium Energy',
      description: 'Progress tasks, steady focus',
      color: 'from-blue-400 to-cyan-500',
      hoverColor: 'hover:shadow-blue-200',
    },
    {
      level: 'low' as EnergyLevel,
      icon: '🌙',
      label: 'Low Energy',
      description: 'Maintenance, small wins',
      color: 'from-indigo-400 to-purple-500',
      hoverColor: 'hover:shadow-purple-200',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-light text-slate-800">
          How do you feel right now?
        </h2>
        <p className="text-slate-500">
          Choose the option that matches your current state
        </p>
      </div>

      <div className="space-y-4">
        {options.map(option => {
          const taskCount = getTaskCount(option.level);
          
          return (
            <button
              key={option.level}
              onClick={() => onSelect(option.level)}
              className={`
                w-full bg-white rounded-2xl p-6 
                border-2 border-slate-200
                hover:border-transparent
                ${option.hoverColor}
                hover:shadow-lg
                transition-all duration-300
                group
                relative
              `}
            >
              {/* Task count badge */}
              {taskCount > 0 && (
                <div className="absolute top-4 right-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shadow-md">
                  {taskCount}
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className={`
                  text-4xl p-3 rounded-xl 
                  bg-gradient-to-br ${option.color}
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  {option.icon}
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-medium text-slate-800 mb-1">
                    {option.label}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {option.description}
                  </p>
                </div>
                <div className="text-slate-400 group-hover:text-slate-600 transition-colors">
                  →
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default EnergySelector;