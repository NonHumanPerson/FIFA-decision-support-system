import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Trophy, Shield, Navigation2, Sun, Moon, Loader2 } from 'lucide-react';
import { cn } from './lib/utils';

const FanHub = lazy(() => import('./components/FanHub'));
const StaffDashboard = lazy(() => import('./components/StaffDashboard'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState<'fan' | 'staff'>('fan');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans flex flex-col selection:bg-emerald-200 dark:selection:bg-emerald-900 transition-colors duration-300">
      
      {/* Top Navigation Bar */}
      <nav className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo area */}
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('fan')}>
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white p-2 rounded-lg shadow-sm">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-gray-900 dark:text-white leading-tight tracking-tight">World Cup 2026</h1>
                <p className="text-[10px] uppercase font-semibold tracking-wider text-emerald-600 dark:text-emerald-400">MatchDay Genie</p>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors duration-300">
              <button
                onClick={() => setIsDark(!isDark)}
                className="flex items-center justify-center p-2 rounded-lg text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50 transition-all duration-200"
                title="Toggle Theme"
                aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
                data-testid="theme-toggle"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setActiveTab('fan')}
                aria-current={activeTab === 'fan' ? 'page' : undefined}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === 'fan' 
                    ? "bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm ring-1 ring-black/5 dark:ring-white/5" 
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
                )}
              >
                <Navigation2 className="w-4 h-4" />
                Fan Hub
              </button>
              <button
                onClick={() => setActiveTab('staff')}
                aria-current={activeTab === 'staff' ? 'page' : undefined}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  activeTab === 'staff' 
                    ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-sm" 
                    : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 hover:bg-gray-200/50 dark:hover:bg-slate-700/50"
                )}
              >
                <Shield className="w-4 h-4" />
                Command Center
              </button>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative">
        <Suspense fallback={<LoadingFallback />}>
          <div className={cn(
            "absolute inset-0 transition-opacity duration-300",
            activeTab === 'fan' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}>
            <FanHub />
          </div>
          
          <div className={cn(
            "absolute inset-0 transition-opacity duration-300 overflow-y-auto",
            activeTab === 'staff' ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}>
            <StaffDashboard />
          </div>
        </Suspense>
      </main>

    </div>
  );
}
