interface BrandLogoProps {
  variant?: 'full' | 'icon' | 'horizontal';
  dark?: boolean;
  className?: string;
}

export default function BrandLogo({ variant = 'horizontal', dark = false, className = '' }: BrandLogoProps) {
  // SVG for the interlocking knot icon
  const KnotIcon = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
      {/* Abstract interlocking knot shape based on brief description */}
      <path d="M50 20 L80 35 L80 65 L50 80 L20 65 L20 35 Z" stroke="var(--color-growmax-red)" strokeWidth="8" strokeLinejoin="round"/>
      <path d="M50 20 L50 50 L80 65" stroke="var(--color-growmax-red)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M20 35 L50 50 L20 65" stroke="var(--color-growmax-red)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );

  const textColor = dark ? 'text-white' : 'text-growmax-black';

  if (variant === 'icon') {
    return <div className={className}><KnotIcon /></div>;
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <KnotIcon />
      <span className={`text-xl font-bold tracking-tight lowercase ${textColor}`} style={{ fontFamily: 'Inter, sans-serif' }}>
        growmax
      </span>
    </div>
  );
}