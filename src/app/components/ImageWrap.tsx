import { useState } from 'react';
import Image from 'next/image';

interface ImageWrapProps {
  src?: string | null;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
}

const ImageWrap = ({
  src,
  width = 20,
  height = 20,
  className = 'rounded-md',
  alt = 'Image',
}: ImageWrapProps) => {
  const [imgSrc, setImgSrc] = useState(src ?? '/bank.jpg');

  return (
    <Image
      src={imgSrc}
      width={width}
      height={height}
      className={className}
      alt={alt}
      onError={() => setImgSrc('/bank.jpg')}
    />
  );
};

export default ImageWrap;