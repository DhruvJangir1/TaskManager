import React from 'react';

interface Props {
  onDismiss: () => void;
  onAction: () => void;
}

const ReminderBanner: React.FC<Props> = ({ onDismiss, onAction }) => {
  return (
    <div className="bg-linear-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-slate-700 font-medium">
              Want to do one small thing?
            </p>
            <p className="text-sm text-slate-600">
              It's been a while — no pressure, just checking in
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onDismiss}
              className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Not now
            </button>
            <button
              onClick={onAction}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Let's go
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReminderBanner;