import { useState } from 'react';
import { asset } from '../menu';
import { Icon } from './Icon';
export function MenuImage({ image, alt, eager = false }: { image: string; alt: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return <div className="image-fallback" role="img" aria-label={alt}><Icon name="cup" size={42} /><span>NOIR</span></div>;
  return <img src={asset(`images/${image}-480.webp`)} srcSet={`${asset(`images/${image}-480.webp`)} 480w, ${asset(`images/${image}-800.webp`)} 800w`} sizes="(max-width: 600px) 50vw, (max-width: 1000px) 45vw, 380px" width="800" height="640" loading={eager ? 'eager' : 'lazy'} decoding="async" alt={alt} onError={() => setFailed(true)} />;
}
