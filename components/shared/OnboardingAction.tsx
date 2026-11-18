import { ctaAttributes, type Placement, type RebateDestination } from "@/lib/analytics";
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
  analytics,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  closedLabel?: React.ReactNode;
  dataPx?: string;
  /** Tracked only while onboarding is open; a closed "Coming soon" control sends nothing. */
  analytics?: { placement: Placement; destination: RebateDestination; advisorSlug?: string };
}) {
  if (ACCESS_ONBOARDING_OPEN) {
    const tracking = analytics ? ctaAttributes(analytics.placement, analytics.destination, analytics.advisorSlug) : {};
    return (
      <a data-px={dataPx} href={href} className={className} {...tracking}>
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
