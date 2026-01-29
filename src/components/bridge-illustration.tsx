interface BridgeIllustrationProps {
  className?: string;
}

// Color palette from design
const colors = {
  teal: '#3BBFAD',
  coral: '#E87D5F',
  red: '#DC4C4C',
  gold: '#E9C46A',
  tealDark: '#2A9A8C',
};

export function BridgeIllustration({ className = '' }: BridgeIllustrationProps) {
  return (
    <svg
      viewBox="0 0 900 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        {/* Gradients for ribbons */}
        <linearGradient id="tealGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.teal} stopOpacity="0.9" />
          <stop offset="100%" stopColor={colors.tealDark} stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="coralGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.coral} stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D66A4A" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.red} stopOpacity="0.8" />
          <stop offset="100%" stopColor="#C43A3A" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={colors.gold} stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4A854" stopOpacity="0.8" />
        </linearGradient>

        {/* Filter for painterly effect */}
        <filter id="painterly" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
        </filter>
      </defs>

      {/* Background flowing ribbons - behind the bridge */}
      <g className="ribbons-back">
        {/* Gold ribbon - sweeping from bottom left */}
        <path
          d="M -50 550
             Q 150 480, 300 420
             Q 500 340, 650 380
             Q 800 420, 950 350"
          fill="none"
          stroke="url(#goldGradient)"
          strokeWidth="45"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Coral ribbon - middle wave */}
        <path
          d="M -80 400
             Q 100 350, 250 380
             Q 450 420, 600 350
             Q 750 280, 950 320"
          fill="none"
          stroke="url(#coralGradient)"
          strokeWidth="55"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.75"
        />
      </g>

      {/* Bridge Structure */}
      <g className="bridge">
        {/* Bridge deck/roadway */}
        <path
          d="M 50 380 L 850 380"
          stroke={colors.teal}
          strokeWidth="8"
          fill="none"
        />
        <path
          d="M 50 388 L 850 388"
          stroke={colors.tealDark}
          strokeWidth="4"
          fill="none"
          opacity="0.6"
        />

        {/* Left tower */}
        <path
          d="M 280 180 L 260 380 L 300 380 L 320 180 Z"
          fill={colors.teal}
        />
        <path
          d="M 270 180 L 250 170 L 350 170 L 330 180 Z"
          fill={colors.tealDark}
        />
        {/* Tower details */}
        <rect x="275" y="220" width="50" height="25" fill={colors.tealDark} opacity="0.3" />
        <rect x="275" y="280" width="50" height="25" fill={colors.tealDark} opacity="0.3" />
        <rect x="275" y="340" width="50" height="25" fill={colors.tealDark} opacity="0.3" />

        {/* Right tower */}
        <path
          d="M 580 180 L 560 380 L 600 380 L 620 180 Z"
          fill={colors.teal}
        />
        <path
          d="M 570 180 L 550 170 L 650 170 L 630 180 Z"
          fill={colors.tealDark}
        />
        {/* Tower details */}
        <rect x="575" y="220" width="50" height="25" fill={colors.tealDark} opacity="0.3" />
        <rect x="575" y="280" width="50" height="25" fill={colors.tealDark} opacity="0.3" />
        <rect x="575" y="340" width="50" height="25" fill={colors.tealDark} opacity="0.3" />

        {/* Main suspension cables */}
        <path
          d="M 50 280
             Q 150 340, 300 180
             Q 450 280, 600 180
             Q 750 340, 850 280"
          fill="none"
          stroke={colors.teal}
          strokeWidth="6"
        />

        {/* Vertical suspender cables */}
        {[120, 160, 200, 240, 360, 400, 440, 480, 660, 700, 740, 780].map((x, i) => {
          const cableHeight = Math.abs(Math.sin((x - 300) * 0.01)) * 80 + 50;
          return (
            <line
              key={i}
              x1={x}
              y1={380 - cableHeight}
              x2={x}
              y2={380}
              stroke={colors.teal}
              strokeWidth="2"
              opacity="0.7"
            />
          );
        })}
      </g>

      {/* Foreground flowing ribbons - in front of bridge */}
      <g className="ribbons-front">
        {/* Teal ribbon - top sweep */}
        <path
          d="M -100 150
             Q 150 100, 350 180
             Q 550 260, 700 200
             Q 850 140, 1000 180"
          fill="none"
          stroke="url(#tealGradient)"
          strokeWidth="65"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* Red ribbon - dramatic diagonal */}
        <path
          d="M -50 300
             Q 200 200, 400 280
             Q 600 360, 800 250
             Q 900 200, 1000 220"
          fill="none"
          stroke="url(#redGradient)"
          strokeWidth="50"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
        />

        {/* Additional thin accent strokes */}
        <path
          d="M 100 500
             Q 300 450, 500 480
             Q 700 510, 900 460"
          fill="none"
          stroke={colors.gold}
          strokeWidth="20"
          strokeLinecap="round"
          opacity="0.5"
        />

        <path
          d="M 200 550
             Q 400 520, 600 560
             Q 800 600, 950 550"
          fill="none"
          stroke={colors.coral}
          strokeWidth="25"
          strokeLinecap="round"
          opacity="0.4"
        />
      </g>

      {/* Paint splatter/drip accents */}
      <g className="splatters" opacity="0.6">
        <circle cx="150" cy="480" r="8" fill={colors.gold} />
        <circle cx="180" cy="510" r="5" fill={colors.gold} />
        <circle cx="720" cy="200" r="6" fill={colors.teal} />
        <circle cx="750" cy="180" r="4" fill={colors.teal} />
        <circle cx="400" cy="520" r="7" fill={colors.coral} />
        <circle cx="850" cy="320" r="5" fill={colors.red} />
        <circle cx="100" cy="350" r="6" fill={colors.coral} />
      </g>
    </svg>
  );
}

export default BridgeIllustration;
