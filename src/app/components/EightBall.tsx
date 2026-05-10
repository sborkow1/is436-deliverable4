export function EightBall({ size = 100 }: { size?: number }) {
  const gradId = `ball-grad-${size}`;
  const shimId = `shim-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id={gradId} cx="35%" cy="28%" r="65%">
          <stop offset="0%" stopColor="#3a3a3a" />
          <stop offset="35%" stopColor="#141414" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
        <radialGradient id={shimId} cx="30%" cy="25%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>
      {/* Drop shadow */}
      <ellipse cx="50" cy="97" rx="36" ry="5" fill="rgba(0,0,0,0.45)" />
      {/* Ball body */}
      <circle cx="50" cy="50" r="47" fill={`url(#${gradId})`} />
      {/* Sheen overlay */}
      <circle cx="50" cy="50" r="47" fill={`url(#${shimId})`} />
      {/* White circle */}
      <circle cx="51" cy="55" r="22" fill="white" />
      {/* Number 8 */}
      <text
        x="51"
        y="63"
        textAnchor="middle"
        fill="#111"
        fontSize="22"
        fontWeight="bold"
        fontFamily="Georgia, serif"
      >
        8
      </text>
    </svg>
  );
}
