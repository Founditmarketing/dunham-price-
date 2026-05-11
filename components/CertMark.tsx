/**
 * Per-cert mark used in cert tile grids.
 *
 * Each accreditation gets its own simple typographic device so the six
 * cert tiles read as distinct trust signals rather than six identical
 * Big Shoulders wordmarks. Hand-built SVGs, trademark-safe (each is a
 * generic geometric/typographic pattern, not a copy of any real logo).
 *
 * Drop-in shape for real logo SVGs when they arrive — same `mark` prop,
 * same sizing, same color contract via `currentColor`.
 *
 *   // TODO: replace with logo SVG (per cert)
 */

interface CertMarkProps {
  abbr: string;
  /** Inherits text color via `currentColor` so it works on dark + cream. */
  className?: string;
}

export function CertMark({ abbr, className = "" }: CertMarkProps) {
  const slug = abbr.toLowerCase();
  const Mark = MARKS[slug] ?? DefaultMark;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-center justify-center ${className}`}
    >
      <Mark abbr={abbr} />
    </span>
  );
}

interface MarkProps {
  abbr: string;
}

const MARKS: Record<string, (p: MarkProps) => React.JSX.Element> = {
  aci: AciMark,
  pci: PciMark,
  nrmca: NrmcaMark,
  caal: CaalMark,
  agc: AgcMark,
  abc: AbcMark,
};

/**
 * ACI — italic mark inside a circle.
 * Visual nod to the ringed/medallion conventions of engineering institutes.
 */
function AciMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className="size-14 sm:size-16"
    >
      <circle
        cx="32"
        cy="32"
        r="29"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="22"
        fontStyle="italic"
        letterSpacing="-0.5"
      >
        ACI
      </text>
    </svg>
  );
}

/**
 * PCI — bold sans wordmark with diagonal accent stripes underneath.
 * Stripes evoke the cast/structural pattern of precast members.
 */
function PciMark() {
  return (
    <svg
      viewBox="0 0 80 64"
      fill="currentColor"
      className="size-14 sm:h-16 sm:w-20"
    >
      <text
        x="40"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="26"
        letterSpacing="-1"
      >
        PCI
      </text>
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1={20 + i * 12}
          y1="50"
          x2={26 + i * 12}
          y2="58"
          stroke="currentColor"
          strokeWidth="2"
        />
      ))}
    </svg>
  );
}

/**
 * NRMCA — stacked NRM / CA in a hairlined rectangle, suggests ID badge.
 */
function NrmcaMark() {
  return (
    <svg
      viewBox="0 0 80 64"
      fill="currentColor"
      className="h-14 w-20 sm:h-16 sm:w-24"
    >
      <rect
        x="3"
        y="3"
        width="74"
        height="58"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <line
        x1="3"
        y1="32"
        x2="77"
        y2="32"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.5"
      />
      <text
        x="40"
        y="24"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="14"
        letterSpacing="1"
      >
        NRM
      </text>
      <text
        x="40"
        y="50"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="14"
        letterSpacing="1"
      >
        CA
      </text>
    </svg>
  );
}

/**
 * CAAL — wordmark in a hexagon. Hex evokes association/state-level seals.
 */
function CaalMark() {
  return (
    <svg
      viewBox="0 0 80 64"
      fill="currentColor"
      className="size-14 sm:h-16 sm:w-20"
    >
      <polygon
        points="14,32 27,8 53,8 66,32 53,56 27,56"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <text
        x="40"
        y="38"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="14"
        letterSpacing="0.5"
      >
        CAAL
      </text>
    </svg>
  );
}

/**
 * AGC — wordmark with a triangular accent. Triangle nods to GC pyramid /
 * structural truss vocabulary.
 */
function AgcMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className="size-14 sm:size-16"
    >
      <polygon
        points="32,6 56,52 8,52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <text
        x="32"
        y="44"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="14"
        letterSpacing="0.5"
      >
        AGC
      </text>
    </svg>
  );
}

/**
 * ABC — wordmark in a square frame, double-rule for structural feel.
 */
function AbcMark() {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="currentColor"
      className="size-14 sm:size-16"
    >
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <rect
        x="11"
        y="11"
        width="42"
        height="42"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        opacity="0.6"
      />
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="20"
        letterSpacing="-0.5"
      >
        ABC
      </text>
    </svg>
  );
}

function DefaultMark({ abbr }: MarkProps) {
  return (
    <svg viewBox="0 0 64 64" fill="currentColor" className="size-14 sm:size-16">
      <text
        x="32"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="900"
        fontSize="20"
        letterSpacing="-0.5"
      >
        {abbr}
      </text>
    </svg>
  );
}
