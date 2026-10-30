/**
 * Hand-drawn icon set. No icon library: these are original paths so the film
 * carries no third-party icon licence and every weight stays consistent.
 */
type IconProps = { size?: number; color?: string; strokeWidth?: number };

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  xmlns: "http://www.w3.org/2000/svg",
});

export const CodeIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 7 4.5 12 9 17" />
    <path d="m15 7 4.5 5L15 17" />
  </svg>
);

export const GlobeIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17" />
    <path d="M12 3.5c2.4 2.3 3.7 5.3 3.7 8.5s-1.3 6.2-3.7 8.5c-2.4-2.3-3.7-5.3-3.7-8.5S9.6 5.8 12 3.5Z" />
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.5 12.4c0 3.6-3.8 6.5-8.5 6.5-1 0-2-.1-2.9-.4L4 20.5l1.4-3.4A5.9 5.9 0 0 1 3.5 12.4C3.5 8.8 7.3 6 12 6s8.5 2.8 8.5 6.4Z" />
    <circle cx="8.6" cy="12.3" r="0.9" fill={color} stroke="none" />
    <circle cx="12" cy="12.3" r="0.9" fill={color} stroke="none" />
    <circle cx="15.4" cy="12.3" r="0.9" fill={color} stroke="none" />
  </svg>
);

export const FlaskIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 3.5h4" />
    <path d="M10.6 3.5v5.2L5.4 18a2.4 2.4 0 0 0 2 3.5h9.2a2.4 2.4 0 0 0 2-3.5l-5.2-9.3V3.5" />
    <path d="M7.8 14.5h8.4" />
  </svg>
);

export const BookIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5.2c2.4-.8 5-.6 7.4.7v13c-2.4-1.3-5-1.5-7.4-.7v-13Z" />
    <path d="M20 5.2c-2.4-.8-5-.6-7.4.7v13c2.4-1.3 5-1.5 7.4-.7v-13Z" />
  </svg>
);

export const SparkIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3.3l1.6 4.9 4.9 1.6-4.9 1.6L12 16.3l-1.6-4.9-4.9-1.6 4.9-1.6L12 3.3Z" />
    <path d="M18.4 15.2l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2.6 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12.6 4.6 4.6L19 6.8" />
  </svg>
);

export const DocIcon: React.FC<IconProps> = ({ size = 24, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...base(size)} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 3.5h7L18.5 8v12.5h-12V3.5Z" />
    <path d="M13 3.8V8.3h4.7" />
    <path d="M9 12.6h6M9 16.2h4" />
  </svg>
);
