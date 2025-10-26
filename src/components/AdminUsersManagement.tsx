import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldOff,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Mail,
  Calendar,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Input,
  Button,
  Badge,
} from './ui';
import {
  getAllUsers,
  toggleUserBlocked,
  setUserAdmin,
  UserProfile,
} from '../services/adminService';

export const AdminUsersManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const pageSize = 10;

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchQuery]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { users: userData, total } = await getAllUsers(
        searchQuery,
        currentPage,
        pageSize
      );
      setUsers(userData);
      setTotalUsers(total);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBlock = async (userId: string, currentBlockStatus: boolean) => {
    const action = currentBlockStatus ? 'unblock' : 'block';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    setProcessingUserId(userId);
    try {
      await toggleUserBlocked(userId, !currentBlockStatus);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user block status:', error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleToggleAdmin = async (userId: string, currentAdminStatus: boolean) => {
    const action = currentAdminStatus ? 'revoke admin access from' : 'grant admin access to';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    setProcessingUserId(userId);
    try {
      await setUserAdmin(userId, !currentAdminStatus);
      await loadUsers();
    } catch (error) {
      console.error('Error toggling user admin status:', error);
      alert(`Failed to ${action} user. Please try again.`);
    } finally {
      setProcessingUserId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  const totalPages = Math.ceil(totalUsers / pageSize);

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-base">All Users</CardTitle>
              <CardDescription className="text-xs">
                Search and manage user accounts
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by email or name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10 h-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="font-semibold text-lg mb-2">
                {searchQuery ? 'No users found' : 'No users yet'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Users will appear here once they register'}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        User
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Joined
                      </th>
                      <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Last Login
                      </th>
                      <th className="text-right py-3 px-4 font-semibold text-sm text-muted-foreground">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.id}
                        className="border-b hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-sm">
                              <span className="text-white font-semibold text-sm">
                                {user.email.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {user.first_name && user.last_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : 'No Name'}
                                </span>
                                {user.is_admin && (
                                  <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-0 gap-1">
                                    <Shield className="w-3 h-3" />
                                    Admin
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {user.is_blocked ? (
                            <Badge
                              variant="secondary"
                              className="bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-0 gap-1"
                            >
                              <AlertTriangle className="w-3 h-3" />
                              Blocked
                            </Badge>
                          ) : (
                            <Badge
                              variant="default"
                              className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0 gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              Active
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {user.last_login ? formatDate(user.last_login) : 'Never'}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleBlock(user.id, user.is_blocked)}
                              disabled={processingUserId === user.id}
                              className="gap-2"
                              title={user.is_blocked ? 'Unblock user' : 'Block user'}
                            >
                              {user.is_blocked ? (
                                <>
                                  <Unlock className="w-4 h-4" />
                                  Unblock
                                </>
                              ) : (
                                <>
                                  <Lock className="w-4 h-4" />
                                  Block
                                </>
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                              disabled={processingUserId === user.id}
                              className="gap-2"
                              title={
                                user.is_admin
                                  ? 'Revoke admin access'
                                  : 'Grant admin access'
                              }
                            >
                              {user.is_admin ? (
                                <>
                                  <ShieldOff className="w-4 h-4" />
                                  Revoke
                                </>
                              ) : (
                                <>
                                  <Shield className="w-4 h-4" />
                                  Grant Admin
                                </>
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * pageSize + 1} to{' '}
                    {Math.min(currentPage * pageSize, totalUsers)} of {totalUsers}{' '}
                    users
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>
                    <span className="text-sm font-medium px-3">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
