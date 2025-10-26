import React, { useState } from 'react';
import { BarChart3, Activity, Pill } from 'lucide-react';
import { DashboardOverview } from './DashboardOverview';
import { DashboardActivity } from './DashboardActivity';
import { DashboardMedications } from './DashboardMedications';

export const AdminMain: React.FC = () => {
  const [activePage, setActivePage] = useState<'overview' | 'activity' | 'medications'>('overview');

  return (
    <div className="space-y-0">
      <div className="flex gap-1 border-b bg-muted/30 -mx-6 px-6">
        <button
          onClick={() => setActivePage('overview')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'overview'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          Overview
        </button>
        <button
          onClick={() => setActivePage('activity')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'activity'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <Activity className="w-4 h-4" />
          Activity
        </button>
        <button
          onClick={() => setActivePage('medications')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'medications'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <Pill className="w-4 h-4" />
          Medications
        </button>
      </div>

      <div className="pt-6">
        {activePage === 'overview' && <DashboardOverview />}
        {activePage === 'activity' && <DashboardActivity />}
        {activePage === 'medications' && <DashboardMedications />}
      </div>
    </div>
  );
};
