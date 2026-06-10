import React from 'react';
import Image from 'next/image';

export function FnancalLogo({ className = "w-6 h-6" }: { className?: string }) {
    return (
        <div className={`relative ${className} overflow-hidden rounded-lg dark:border dark:border-border/10 dark:shadow-xs`}>
            <Image
                src="/site_logo.webp"
                alt="Fnancal Logo"
                fill
                className="object-cover dark:invert brightness-[1.06] contrast-[1.05] dark:brightness-100 dark:contrast-100 transition-all duration-300"
                priority
            />
        </div>
    );
}
