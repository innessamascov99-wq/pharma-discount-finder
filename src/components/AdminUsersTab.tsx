import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { AdminNewUsers } from './AdminNewUsers';
import { AdminAllUsers } from './AdminAllUsers';

export const AdminUsersTab: React.FC = () => {
  const [activePage, setActivePage] = useState<'new' | 'all'>('all');

  return (
    <div className="space-y-0">
      <div className="flex gap-1 border-b bg-muted/30 -mx-6 px-6">
        <button
          onClick={() => setActivePage('new')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'new'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          New Users
        </button>
        <button
          onClick={() => setActivePage('all')}
          className={`flex items-center gap-2 px-4 py-3 font-medium text-sm transition-colors border-b-2 -mb-px ${
            activePage === 'all'
              ? 'border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500 bg-background'
              : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-background/50'
          }`}
        >
          <Users className="w-4 h-4" />
          All Users
        </button>
      </div>

      <div className="pt-6">
        {activePage === 'new' && <AdminNewUsers />}
        {activePage === 'all' && <AdminAllUsers />}
      </div>
    </div>
  );
};
