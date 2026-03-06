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
  return (
    <img
      src="/images/obo-bettermann-logo.svg"
      alt="OBO Bettermann"
      className={`${className} ${variant === 'light' ? 'brightness-0 invert' : ''}`}
      data-testid="img-logo-obo-bettermann"
    />
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
