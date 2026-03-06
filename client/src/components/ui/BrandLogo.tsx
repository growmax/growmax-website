interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  dark?: boolean;
  className?: string;
}

export default function BrandLogo({ variant = 'horizontal', dark = false, className = '' }: BrandLogoProps) {
  if (variant === 'icon') {
    return (
      <div className={className}>
        <img src="/icon-100.png" alt="Growmax" className="w-8 h-8" />
      </div>
    );
  }

  const logoSrc = dark ? '/logo-white.png' : '/logo-dark.png';

  return (
    <div className={`flex items-center ${className}`}>
      <img src={logoSrc} alt="Growmax" className="h-8 w-auto" data-testid="img-brand-logo" />
    </div>
  );
}
