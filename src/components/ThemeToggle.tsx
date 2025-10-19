import React from 'react';
import { Sun, Moon, CircleDot } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Default' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'monochrome' as const, icon: CircleDot, label: 'Monochrome' }
  ];

  return (
    <div className="flex items-center gap-1 bg-muted/50 dark:bg-muted/30 rounded-lg p-1 shadow-sm dark:shadow-cyan-500/10">
      {themes.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={theme === value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setTheme(value)}
          className={`gap-2 h-9 transition-all duration-200 ${
            theme === value
              ? 'dark:bg-gradient-to-r dark:from-cyan-600 dark:to-emerald-600 dark:shadow-lg dark:shadow-cyan-500/30'
              : 'dark:hover:bg-accent/30'
          }`}
          title={label}
        >
          <Icon className={`w-4 h-4 ${theme === value ? 'dark:text-white' : 'dark:text-cyan-400'}`} />
          <span className={`hidden sm:inline ${theme === value ? 'dark:text-white' : 'dark:text-cyan-300'}`}>{label}</span>
        </Button>
      ))}
    </div>
  );
};
