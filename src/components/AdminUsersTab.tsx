import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { AdminNewUsers } from './AdminNewUsers';
import { AdminAllUsers } from './AdminAllUsers';

export const AdminUsersTab: React.FC = () => {
  const [activePage, setActivePage] = useState<'new' | 'all'>('new');

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActivePage('new')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activePage === 'new'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          New Users
        </button>
        <button
          onClick={() => setActivePage('all')}
          className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
            activePage === 'all'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Users className="w-4 h-4" />
          All Users
        </button>
      </div>

      <div className="pt-2">
        {activePage === 'new' && <AdminNewUsers />}
        {activePage === 'all' && <AdminAllUsers />}
      </div>
    </div>
  );
};
