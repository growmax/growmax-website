interface ClientLogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-6 max-w-[120px]',
  md: 'h-9 max-w-[160px]',
  lg: 'h-12 max-w-[200px]',
};

export function SiemensLogo({ className = '', variant = 'dark', size = 'md' }: ClientLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/images/siemens-logo.svg"
        alt="Siemens"
        className={`${sizeMap[size]} w-auto object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        data-testid="img-logo-siemens"
      />
    </div>
  );
}

export function SchwingSttetterLogo({ className = '', variant = 'dark', size = 'md' }: ClientLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/images/schwing-stetter-logo.png"
        alt="Schwing Stetter"
        className={`${sizeMap[size]} w-auto object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        data-testid="img-logo-schwing-stetter"
      />
    </div>
  );
}

export function OBOBettermannLogo({ className = '', variant = 'dark', size = 'md' }: ClientLogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <img
        src="/images/obo-bettermann-logo.svg"
        alt="OBO Bettermann"
        className={`${sizeMap[size]} w-auto object-contain ${variant === 'light' ? 'brightness-0 invert' : ''}`}
        data-testid="img-logo-obo-bettermann"
      />
    </div>
  );
}

export function ClientLogoBar({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  return (
    <>
      <SiemensLogo variant={variant} size="md" />
      <SchwingSttetterLogo variant={variant} size="md" />
      <OBOBettermannLogo variant={variant} size="md" />
    </>
  );
}
