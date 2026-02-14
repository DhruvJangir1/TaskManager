import React, { useState } from 'react';
import { EnergyLevel, TimeEstimate } from './types';

interface Props {
  onSave: (task: {
    title: string;
    energyLevel: EnergyLevel;
    estimatedTime: TimeEstimate;
    customTime?: number;
    note?: string;
    flexible: boolean;
  }) => void;
  onCancel: () => void;
  defaultEnergy?: EnergyLevel; // Add this prop
}

const TaskCreator: React.FC<Props> = ({ onSave, onCancel, defaultEnergy }) => {
  const [title, setTitle] = useState('');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(defaultEnergy || 'medium'); // Use defaultEnergy
  const [estimatedTime, setEstimatedTime] = useState<TimeEstimate>('15m');
  const [customTime, setCustomTime] = useState(30);
  const [note, setNote] = useState('');
  const [flexible, setFlexible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    onSave({
      title: title.trim(),
      energyLevel,
      estimatedTime,
      customTime: estimatedTime === 'custom' ? customTime : undefined,
      note: note.trim() || undefined,
      flexible,
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button
          onClick={onCancel}
          className="text-slate-500 hover:text-slate-700 transition-colors flex items-center gap-2"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
        <h2 className="text-2xl font-light text-slate-800 mb-6">Create Task</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              What needs to be done?
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Review project proposal"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
              autoFocus
            />
          </div>

          {/* Energy Level */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Energy required
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'high', label: 'High', icon: '⚡', color: 'border-amber-400 bg-amber-50' },
                { value: 'medium', label: 'Medium', icon: '🌤', color: 'border-blue-400 bg-blue-50' },
                { value: 'low', label: 'Low', icon: '🌙', color: 'border-purple-400 bg-purple-50' },
              ].map(option => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEnergyLevel(option.value as EnergyLevel)}
                  className={`
                    px-4 py-3 rounded-lg border-2 transition-all
                    ${energyLevel === option.value 
                      ? `${option.color} border-opacity-100` 
                      : 'border-slate-200 hover:border-slate-300'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{option.icon}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Estimated Time */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Estimated time
            </label>
            <div className="grid grid-cols-4 gap-3">
              {['5m', '15m', '30m', 'custom'].map(time => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setEstimatedTime(time as TimeEstimate)}
                  className={`
                    px-3 py-2 rounded-lg border-2 transition-all text-sm
                    ${estimatedTime === time 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-slate-200 hover:border-slate-300'
                    }
                  `}
                >
                  {time === 'custom' ? 'Custom' : time}
                </button>
              ))}
            </div>
            
            {/* Custom Time Slider */}
            {estimatedTime === 'custom' && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">
                    Duration
                  </span>
                  <span className="text-2xl font-light text-blue-600">
                    {customTime} min
                  </span>
                </div>
                
                <input
                  type="range"
                  min="5"
                  max="240"
                  step="5"
                  value={customTime}
                  onChange={(e) => setCustomTime(parseInt(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>5 min</span>
                  <span>240 min</span>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Note (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add context or details..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
            />
          </div>

          {/* Flexible */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={flexible}
                onChange={(e) => setFlexible(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <span className="text-sm text-slate-700">
                Flexible (can appear in nearby energy levels)
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              style={{
                background: title.trim() ? 'linear-gradient(to right, #3b82f6, #06b6d4)' : undefined
              }}
              className="flex-1 px-6 py-3 rounded-lg text-white font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-300 transition-all"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskCreator;