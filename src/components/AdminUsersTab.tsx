import React, { useState } from 'react';
import { Users, Database } from 'lucide-react';
import { AdminUsers } from './AdminUsers';
import { AdminDatabase } from './AdminDatabase';

export const AdminUsersTab: React.FC = () => {
  const [activePage, setActivePage] = useState<'users' | 'database'>('users');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActivePage('users')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activePage === 'users'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          Users
        </button>
        <button
          onClick={() => setActivePage('database')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activePage === 'database'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Database className="w-4 h-4" />
          Database
        </button>
      </div>

      <div className="pt-2">
        {activePage === 'users' && <AdminUsers />}
        {activePage === 'database' && <AdminDatabase />}
      </div>
    </div>
  );
};
