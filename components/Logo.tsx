// TODO: replace with SVG logo
interface LogoProps {
  className?: string;
  /** Compact two-line lockup vs single-line wordmark. */
  stacked?: boolean;
}

export function Logo({ className = "", stacked = false }: LogoProps) {
  if (stacked) {
    return (
      <span
        className={`font-display font-black leading-[0.85] tracking-tight text-primary ${className}`}
      >
        <span className="block text-2xl">DUNHAM</span>
        <span className="block text-2xl">
          PRICE<span className="text-accent">.</span>
        </span>
      </span>
    );
  }

  return (
    <span
      className={`font-display font-black tracking-tight text-primary text-xl sm:text-2xl ${className}`}
    >
      DUNHAM&nbsp;PRICE<span className="text-accent">.</span>
    </span>
  );
}
