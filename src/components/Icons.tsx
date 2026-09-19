import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export function IconSidebar(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3" y="4" width="18" height="16" rx="2.2" />
      <path d="M9 4v16" />
    </svg>
  );
}

export function IconCompose(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

export function IconPlus(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function IconFolder(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4.2l1.6 1.8H19.5A1.5 1.5 0 0 1 21 9.3v7.2a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 16.5v-9z" />
    </svg>
  );
}

export function IconLayout(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
    </svg>
  );
}

export function IconGear(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M4.9 7.2l1.9 1.1M17.2 15.7l1.9 1.1M3.5 12h2.2M18.3 12h2.2M4.9 16.8l1.9-1.1M17.2 8.3l1.9-1.1" />
    </svg>
  );
}

export function IconShareBox(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M14 4h6v6" />
      <path d="M20 4l-9 9" />
      <path d="M20 14v4.5A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H10" />
    </svg>
  );
}

export function IconChevron(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

export function IconChevronLeft(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M15 6l-6 6 6 6" />
    </svg>
  );
}

export function IconCopy(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M4 16V6a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function IconShareNodes(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="18" cy="5" r="2.4" />
      <circle cx="6" cy="12" r="2.4" />
      <circle cx="18" cy="19" r="2.4" />
      <path d="M8.2 13.2l7.5 4.1M15.7 6.7l-7.5 4.1" />
    </svg>
  );
}

export function IconCloud(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7.5 18h9.2a3.8 3.8 0 0 0 .6-7.55 5.2 5.2 0 0 0-10-1.4A3.6 3.6 0 0 0 7.5 18z" />
    </svg>
  );
}

export function IconMic(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V21" />
    </svg>
  );
}

export function IconArrowUp(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} strokeWidth={2.2} {...rest}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function IconSearch(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function IconMinus(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconExpand(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M9 3H3v6M15 3h6v6M9 21H3v-6M21 15v6h-6" />
    </svg>
  );
}

export function IconDownload(props: IconProps) {
  const { size = 15, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 4v12M7 12l5 5 5-5M5 20h14" />
    </svg>
  );
}

export function IconClose(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function IconMenu(props: IconProps) {
  const { size = 18, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

export function IconDots(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="6" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconSun(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 3.5v2M12 18.5v2M4.7 4.7l1.4 1.4M17.9 17.9l1.4 1.4M3.5 12h2M18.5 12h2M4.7 19.3l1.4-1.4M17.9 6.1l1.4-1.4" />
    </svg>
  );
}

export function IconDrop(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M12 3.5c3.5 4.2 6 7.4 6 10.2A6 6 0 1 1 6 13.7C6 10.9 8.5 7.7 12 3.5z" />
    </svg>
  );
}

export function IconRuler(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="4" y="8.5" width="16" height="7" rx="1.2" transform="rotate(-18 12 12)" />
      <path d="M8 11.2l1.2-.4M10.2 10.5l1.2-.4M12.4 9.8l1.2-.4" />
    </svg>
  );
}

export function IconLeaf(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 19c8-1 13-7 14-14-7 1-13 6-14 14z" />
      <path d="M8 16c2-2 5-5 8-7" />
    </svg>
  );
}

export function IconPdf(props: IconProps) {
  const { size = 28, ...rest } = props;
  return (
    <svg width={size} height={size * 1.15} viewBox="0 0 40 46" fill="none" {...rest}>
      <rect x="4" y="2" width="28" height="38" rx="3" fill="#fff" stroke="#e2e2e2" />
      <rect x="8" y="10" width="16" height="2.2" rx="1" fill="#d8d8d8" />
      <rect x="8" y="15" width="20" height="2.2" rx="1" fill="#ececec" />
      <rect x="8" y="20" width="14" height="2.2" rx="1" fill="#ececec" />
      <rect x="8" y="25" width="18" height="2.2" rx="1" fill="#ececec" />
      <rect x="22" y="28" width="16" height="16" rx="3" fill="#e24b4b" />
      <path d="M26.2 33.2h2.1c1.1 0 1.8.6 1.8 1.55 0 1-.7 1.6-1.85 1.6H26.2v-3.15zm1.05 2.35h.9c.45 0 .75-.25.75-.7 0-.42-.28-.7-.74-.7h-.91v1.4zM31.1 33.2h2.55v.88h-1.5v.7h1.38v.85H32.15v1.6h-1.05V33.2zM35.05 33.2h1.05v3.15h1.7v.88h-2.75V33.2z" fill="#fff" />
    </svg>
  );
}

export function IconDocTab(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M7 4h6l4 4v12a1.5 1.5 0 0 1-1.5 1.5h-8.5A1.5 1.5 0 0 1 5.5 20V5.5A1.5 1.5 0 0 1 7 4z" />
      <path d="M13 4v4h4" />
    </svg>
  );
}

export function IconKey(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <circle cx="8" cy="14" r="3.2" />
      <path d="M10.4 12.2L20 3.8M16.5 4.2l3.2 3.2" />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  const { size = 14, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <path d="M5 12.5l4.2 4.2L19 7.5" />
    </svg>
  );
}

export function IconPanel(props: IconProps) {
  const { size = 16, ...rest } = props;
  return (
    <svg {...base(size)} {...rest}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M15 4v16" />
    </svg>
  );
}
