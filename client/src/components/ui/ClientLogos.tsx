interface ClientLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function SiemensLogo({ className = '', variant = 'dark' }: ClientLogoProps) {
  const color = variant === 'light' ? '#ffffff' : '#009999';
  return (
    <svg viewBox="0 0 280 50" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Siemens">
      <text x="0" y="40" fontFamily="'Georgia', 'Times New Roman', serif" fontWeight="400" fontSize="46" letterSpacing="4" fill={color}>
        SIEMENS
      </text>
    </svg>
  );
}

export function SchwingSttetterLogo({ className = '', variant = 'dark' }: ClientLogoProps) {
  const primaryColor = variant === 'light' ? '#ffffff' : '#E30613';
  const secondaryColor = variant === 'light' ? '#cccccc' : '#333333';
  return (
    <svg viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="Schwing Stetter">
      <rect x="0" y="2" width="10" height="56" fill={primaryColor} rx="0" />
      <text x="20" y="32" fontFamily="'Arial Black', 'Helvetica', sans-serif" fontWeight="900" fontSize="28" letterSpacing="3" fill={primaryColor}>
        SCHWING
      </text>
      <text x="20" y="52" fontFamily="'Arial', 'Helvetica', sans-serif" fontWeight="600" fontSize="18" letterSpacing="5" fill={secondaryColor}>
        STETTER
      </text>
    </svg>
  );
}

export function OBOBettermannLogo({ className = '', variant = 'dark' }: ClientLogoProps) {
  const primaryColor = variant === 'light' ? '#ffffff' : '#E84E0F';
  const secondaryColor = variant === 'light' ? '#cccccc' : '#333333';
  return (
    <svg viewBox="0 0 320 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-label="OBO Bettermann">
      <text x="0" y="38" fontFamily="'Arial Black', 'Helvetica', sans-serif" fontWeight="900" fontSize="42" letterSpacing="3" fill={primaryColor}>
        OBO
      </text>
      <text x="128" y="38" fontFamily="'Arial', 'Helvetica', sans-serif" fontWeight="600" fontSize="20" letterSpacing="2" fill={secondaryColor}>
        Bettermann
      </text>
    </svg>
  );
}

export function ClientLogoBar({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <>
      <SiemensLogo className="h-8 md:h-10 w-auto" variant={variant} />
      <SchwingSttetterLogo className="h-8 md:h-10 w-auto" variant={variant} />
      <OBOBettermannLogo className="h-8 md:h-10 w-auto" variant={variant} />
    </>
  );
}
