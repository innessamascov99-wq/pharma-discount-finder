import React, { useState, useEffect } from 'react';
import { Database, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [programCount, setProgramCount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    setError('');

    try {
      const { count, error: countError } = await supabase
        .from('pharma_programs')
        .select('count', { count: 'exact', head: true })
        .eq('active', true);

      if (countError) {
        throw new Error(countError.message);
      }

      setProgramCount(count || 0);
      setStatus('connected');
    } catch (err: any) {
      console.error('Database connection failed:', err);
      setError(err.message || 'Connection failed');
      setStatus('error');
    }
  };

  if (!showDetails && status === 'connected') {
    return null;
  }

  const statusConfig = {
    checking: {
      icon: Loader2,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'Checking connection...'
    },
    connected: {
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: `Connected - ${programCount} programs available`
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: `Connection failed: ${error}`
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${config.bg} ${config.border} shadow-lg`}>
        <Database className="w-4 h-4 text-muted-foreground" />
        <Icon className={`w-4 h-4 ${config.color} ${status === 'checking' ? 'animate-spin' : ''}`} />
        <span className="text-sm font-medium">{config.text}</span>
        {status === 'error' && (
          <button
            onClick={checkConnection}
            className="ml-2 text-xs font-semibold text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        )}
        {status === 'connected' && (
          <button
            onClick={() => setShowDetails(false)}
            className="ml-2 text-xs font-semibold text-gray-600 hover:text-gray-800"
          >
            Hide
          </button>
        )}
      </div>
    </div>
  );
};
