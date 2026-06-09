// src/components/ThemeInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/stores/theme-store';

export function ThemeInitializer() {
    const theme = useThemeStore((s) => s.theme);
    const hasHydrated = useThemeStore((s) => s._hasHydrated);

    useEffect(() => {
        if (hasHydrated) {
            const root = document.documentElement;
            if (theme === 'dark') {
                root.classList.add('dark');
            } else {
                root.classList.remove('dark');
            }
        }
    }, [theme, hasHydrated]);

    return null;
}
