interface ClientLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export function SiemensLogo({ className = '', variant = 'dark' }: ClientLogoProps) {
  return (
    <img
      src="/images/siemens-logo.svg"
      alt="Siemens"
      className={`${className} ${variant === 'light' ? 'brightness-0 invert' : ''}`}
      data-testid="img-logo-siemens"
    />
  );
}

export function SchwingSttetterLogo({ className = '', variant = 'dark' }: ClientLogoProps) {
  return (
    <img
      src="/images/schwing-stetter-logo.png"
      alt="Schwing Stetter"
      className={`${className} ${variant === 'light' ? 'brightness-0 invert' : ''}`}
      data-testid="img-logo-schwing-stetter"
    />
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
