import React, { useState } from 'react';
import { Search, Database } from 'lucide-react';
import { DatabaseSearch } from './DatabaseSearch';
import { DatabaseManage } from './DatabaseManage';

export const AdminDatabase: React.FC = () => {
  const [activePage, setActivePage] = useState<'search' | 'manage'>('search');

  return (
    <div className="space-y-0">
      <div className="flex gap-1 border-b bg-muted/30 -mx-6 px-6">
        <button
          onClick={() => setActivePage('search')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'search'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <Search className="w-4 h-4" />
          Search
        </button>
        <button
          onClick={() => setActivePage('manage')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'manage'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <Database className="w-4 h-4" />
          Manage
        </button>
      </div>

      <div className="pt-6">
        {activePage === 'search' && <DatabaseSearch />}
        {activePage === 'manage' && <DatabaseManage />}
      </div>
    </div>
  );
};
