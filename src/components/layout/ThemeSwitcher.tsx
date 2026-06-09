// src/components/ThemeSwitcher.tsx
'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '@/stores/theme-store';
import { Button } from '@/components/ui/button';

export function ThemeSwitcher() {
    const theme = useThemeStore((s) => s.theme);
    const setTheme = useThemeStore((s) => s.setTheme);
    const hasHydrated = useThemeStore((s) => s._hasHydrated);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    if (!hasHydrated) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9 rounded-md opacity-50 cursor-not-allowed">
                <Sun className="h-4 w-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="w-9 h-9 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors cursor-pointer"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
            ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
            )}
        </Button>
    );
}
