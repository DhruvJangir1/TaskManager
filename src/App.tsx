import { useState, useEffect } from 'react';
import { Task, EnergyLevel, AppData } from './TaskManager/types';
import { loadData, saveData, clearAllData, exportData } from './TaskManager/storage';
import EnergySelector from './TaskManager/EnergySelector';
import TaskCreator from './TaskManager/TaskCreator';
import TaskList from './TaskManager/TaskList';
import ReminderBanner from './TaskManager/ReminderBanner';
import Dashboard from './TaskManager/Dashboard';

type View = 'energy' | 'tasks' | 'create' | 'dashboard';

function App() {
  const [data, setData] = useState<AppData>(loadData());
  const [view, setView] = useState<View>('energy');
  const [showReminder, setShowReminder] = useState(false);

  // Persist data whenever it changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Check if reminder should be shown (18-24 hours since last activity)
  useEffect(() => {
    const hoursSinceActivity = (Date.now() - data.userState.lastActivityAt) / (1000 * 60 * 60);
    const hoursSinceLastReminder = data.userState.lastReminderShown 
      ? (Date.now() - data.userState.lastReminderShown) / (1000 * 60 * 60)
      : 999;
    
    if (hoursSinceActivity >= 18 && hoursSinceLastReminder >= 12 && data.userState.reminderPreference !== 'none') {
      setShowReminder(true);
    }
  }, [data.userState.lastActivityAt, data.userState.lastReminderShown, data.userState.reminderPreference]);

  const handleEnergySelect = (energy: EnergyLevel) => {
    setData(prev => ({
      ...prev,
      userState: {
        ...prev.userState,
        currentEnergy: energy,
        lastActivityAt: Date.now(),
      }
    }));
    setView('tasks');
    setShowReminder(false);
  };

  const handleTaskCreate = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
    };
    
    setData(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
      userState: {
        ...prev.userState,
        lastActivityAt: Date.now(),
      }
    }));
    
    setView('tasks');
  };

  const handleTaskComplete = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, completedAt: Date.now() } : task
      ),
      userState: {
        ...prev.userState,
        lastActivityAt: Date.now(),
      }
    }));
  };

  const handleTaskDelete = (taskId: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId)
    }));
  };

  const handleTaskEdit = (taskId: string, updates: Partial<Task>) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === taskId ? { ...task, ...updates } : task
      )
    }));
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all data? This cannot be undone.')) {
      clearAllData();
      setData(loadData());
      setView('energy');
    }
  };

  const handleExport = () => {
    const dataStr = exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `energiflow-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDismissReminder = () => {
    setShowReminder(false);
    setData(prev => ({
      ...prev,
      userState: {
        ...prev.userState,
        lastReminderShown: Date.now(),
      }
    }));
  };

  const activeTasks = data.tasks.filter(task => !task.completedAt);
  const completedTasks = data.tasks.filter(task => task.completedAt);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="cursor-pointer text-2xl font-light text-slate-800"                 
          onClick={() => setView('energy')}>EnergiFlow</h1>
          <div className="flex gap-2">
            {view !== 'energy' && (
              <button
                onClick={() => setView('energy')}
                className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 transition-colors"
              >
                Reset
              </button>
            )}
            <button
              onClick={() => setView('dashboard')}
              className="px-3 py-1.5 text-sm text-slate-600 hover:text-slate-800 transition-colors"
            >
              Insights
            </button>
          </div>
        </div>
      </header>

      {/* Reminder Banner */}
      {showReminder && (
        <ReminderBanner 
          onDismiss={handleDismissReminder}
          onAction={() => {
            handleDismissReminder();
            setView('energy');
          }}
        />
      )}

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        {view === 'energy' && (
  <EnergySelector 
    onSelect={handleEnergySelect} 
    tasks={activeTasks}
  />
)}

        {view === 'tasks' && data.userState.currentEnergy && (
          <TaskList
            tasks={activeTasks}
            currentEnergy={data.userState.currentEnergy}
            onComplete={handleTaskComplete}
            onDelete={handleTaskDelete}
            onEdit={handleTaskEdit}
            onCreateNew={() => setView('create')}
            onChangeEnergy={() => setView('energy')}
          />
        )}

        {view === 'create' && (
          <TaskCreator
            onSave={handleTaskCreate}
            onCancel={() => setView('tasks')}
            defaultEnergy={data.userState.currentEnergy}
          />
        )}

        {view === 'dashboard' && (
          <Dashboard
            tasks={data.tasks}
            userState={data.userState}
            onBack={() => setView(data.userState.currentEnergy ? 'tasks' : 'energy')}
            onClearAll={handleClearAll}
            onExport={handleExport}
            onUpdateReminder={(pref) => {
              setData(prev => ({
                ...prev,
                userState: { ...prev.userState, reminderPreference: pref }
              }));
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;