import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  dark?: boolean;
  crossfade?: boolean;
  className?: string;
}

export default function BrandLogo({ variant = 'horizontal', dark = false, crossfade = false, className = '' }: BrandLogoProps) {
  if (variant === 'icon') {
    return (
      <div className={className}>
        <Image src="/icon-100.png" alt="Growmax" width={32} height={32} className="w-8 h-8" priority />
      </div>
    );
  }

  if (crossfade) {
    return (
      <div className={`relative flex items-center ${className}`}>
        <Image
          src="/logo-color.png"
          alt="Growmax"
          width={150}
          height={32}
          priority
          className="h-8 w-auto transition-opacity duration-200 group-hover:opacity-0"
          data-testid="img-brand-logo"
        />
        <Image
          src="/logo-white.png"
          alt=""
          aria-hidden="true"
          width={150}
          height={32}
          className="absolute inset-0 h-8 w-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        />
      </div>
    );
  }

  const logoSrc = dark ? '/logo-white.png' : '/logo-dark.png';

  return (
    <div className={`flex items-center ${className}`}>
      <Image src={logoSrc} alt="Growmax" width={150} height={32} priority className="h-8 w-auto" data-testid="img-brand-logo" />
    </div>
  );
}
