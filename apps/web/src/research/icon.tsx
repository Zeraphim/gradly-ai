import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileText,
  FlaskConical,
  LayoutTemplate,
  LoaderCircle,
  MessagesSquare,
  RotateCcw,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Upload,
  X,
} from "lucide-react";

const icons = {
  book: BookOpen,
  document: FileText,
  phone: Smartphone,
  check: Check,
  star: Star,
  retry: RotateCcw,
  arrow: ArrowRight,
  back: ArrowLeft,
  upload: Upload,
  search: Search,
  layout: LayoutTemplate,
  chart: ChartNoAxesCombined,
  coach: MessagesSquare,
  shield: ShieldCheck,
  close: X,
  chevron: ChevronDown,
  loading: LoaderCircle,
  research: FlaskConical,
  verify: ClipboardCheck,
  sparkle: Sparkles,
};
export type IconName = keyof typeof icons;
export function Icon({
  name,
  size = 24,
  className,
  strong = false,
}: {
  name: IconName;
  size?: number;
  className?: string;
  strong?: boolean;
}) {
  const Component = icons[name];
  return (
    <Component
      size={size}
      strokeWidth={strong ? 2.5 : 2}
      absoluteStrokeWidth
      className={className}
      aria-hidden="true"
      focusable="false"
    />
  );
}

export function ActionLabel({
  children,
  icon = "arrow",
  busy = false,
}: {
  children: React.ReactNode;
  icon?: IconName;
  busy?: boolean;
}) {
  return (
    <>
      <span className="action-label">{children}</span>
      <Icon
        strong
        name={busy ? "loading" : icon}
        size={19}
        className={busy ? "action-icon is-spinning" : "action-icon"}
      />
    </>
  );
}
