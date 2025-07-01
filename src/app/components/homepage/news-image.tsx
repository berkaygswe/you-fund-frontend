'use client';

import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface NewsImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function NewsImage({ src, alt, className = '' }: NewsImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-24 h-16 sm:w-32 sm:h-20 rounded-md bg-muted flex items-center justify-center">
        <ImageIcon className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="relative w-24 h-16 sm:w-32 sm:h-20 rounded-md overflow-hidden bg-muted">
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ${className}`}
        onError={() => setHasError(true)}
        loading="lazy"
      />
    </div>
  );
}