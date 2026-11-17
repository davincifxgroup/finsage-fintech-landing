import { ACCESS_ONBOARDING_OPEN, COMING_SOON } from "@/lib/site";

/**
 * An Access onboarding action. While onboarding is closed (the default) it keeps the
 * element's styling but is not a link: it reads "Coming soon" (or `closedLabel`), is
 * marked aria-disabled and ignores the pointer. Server-side admission stays the control.
 */
export function OnboardingAction({
  href,
  className,
  children,
  closedLabel = COMING_SOON,
  dataPx,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  closedLabel?: React.ReactNode;
  dataPx?: string;
}) {
  if (ACCESS_ONBOARDING_OPEN) {
    return (
      <a data-px={dataPx} href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <span
      data-px={dataPx}
      data-coming-soon=""
      role="link"
      aria-disabled="true"
      className={`${className ?? ""} pointer-events-none cursor-default`}
    >
      {closedLabel}
    </span>
  );
}
