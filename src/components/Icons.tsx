import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 20): SVGProps<SVGSVGElement> => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.1,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
});

export const SearchIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);
export const UserIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
  </svg>
);
export const BagIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 8h14l-1 13H6L5 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
);
export const MenuIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 8h18M3 16h18" />
  </svg>
);
export const CloseIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 5l14 14M19 5 5 19" />
  </svg>
);
export const ChevronDown = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);
export const ChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m15 6-6 6 6 6" />
  </svg>
);
export const ChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);
export const PlusIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const MinusIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M5 12h14" />
  </svg>
);
export const ArrowRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 12h18M15 6l6 6-6 6" />
  </svg>
);
export const UploadIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 16V4M7 9l5-5 5 5M4 16v4h16v-4" />
  </svg>
);
export const CheckIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="m4.5 12.5 5 5 10-11" />
  </svg>
);
export const InfoIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v6M12 7.5v.5" />
  </svg>
);
export const FlameIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M12 21c-3.9 0-6.5-2.6-6.5-6.2 0-3.4 2.6-5.6 3.8-8.8.6 1.9 1.6 3 2.7 3.6.3-2.4 1.5-4.5 3-5.6-.2 2.8 3.5 5.6 3.5 10.6 0 3.7-2.6 6.4-6.5 6.4Z" />
  </svg>
);
export const TruckIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M2.5 6.5h11v10h-11zM13.5 10h4l3 3v3.5h-7" />
    <circle cx="7" cy="17.5" r="1.8" />
    <circle cx="17" cy="17.5" r="1.8" />
  </svg>
);
export const DocIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 3h8l4 4v14H6z" />
    <path d="M14 3v4h4M9 12h6M9 16h6" />
  </svg>
);
export const ExternalIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6" />
  </svg>
);
export const PlayIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
);
export const PauseIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none">
    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
  </svg>
);
export const VolumeIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
    <path d="M15.5 9a4.2 4.2 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11" />
  </svg>
);
export const VolumeOffIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5h3.5L12 5.5v13L7.5 14.5H4z" />
    <path d="m16 9.5 4 5M20 9.5l-4 5" />
  </svg>
);
