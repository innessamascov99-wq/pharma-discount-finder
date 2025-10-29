import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, CircleDot, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const themes = [
    { value: 'light' as const, icon: Sun, label: 'Light' },
    { value: 'dark' as const, icon: Moon, label: 'Dark' },
    { value: 'grayscale' as const, icon: CircleDot, label: 'Monochrome' }
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleThemeSelect = (value: 'light' | 'dark' | 'grayscale') => {
    setTheme(value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors border border-border/50"
        aria-label="Select theme"
        aria-expanded={isOpen}
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">{currentTheme.label}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-background border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {themes.map(({ value, icon: Icon, label }) => (
            <button
              key={value}
              onClick={() => handleThemeSelect(value)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                theme === value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted text-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
