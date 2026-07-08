import React from 'react';
import { Card } from '@/components/ui/card';

export function GlassCard({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <Card className={`border border-white/40 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] ${className}`}>
            {children}
        </Card>
    );
}
