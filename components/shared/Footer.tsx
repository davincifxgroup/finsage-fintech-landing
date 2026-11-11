import { asset, links, type NavLink } from "@/lib/site";

const navigationLinks: NavLink[] = [
  { label: "Advisors", href: "#advisors" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Our Testing", href: "#testing" },
  { label: "Brokers", href: "#brokers" },
  { label: "FAQ", href: "#faq" },
];

const toolLinks: NavLink[] = [
  { label: "Log In", href: links.login },
  { label: "Create Account", href: links.register },
  { label: "Dashboard", href: links.dashboard },
];

const resourceLinks: NavLink[] = [
  { label: "EA Forex LAB", href: links.mainSite },
  { label: "ForexLAB Rebate", href: links.rebate },
  { label: "Risk Disclosure", href: "#risk" },
];

export function Footer() {
  return (
    <footer
      data-px="footer"
      className="
        footer
        relative isolate w-full overflow-hidden
        bg-white text-black
        [font-family:Lato,Arial,sans-serif]

        lg:aspect-[1199/480]
      "
    >
      {/* ====================================================== */}
      {/* BACKGROUND                                             */}
      {/* ====================================================== */}

      <div
        data-px="footer.background"
        aria-hidden="true"
        className="
          pointer-events-none
          absolute inset-0
          bg-white
        "
      />

      {/* ====================================================== */}
      {/* CANONICAL 1199 × 480 FRAME                             */}
      {/* ====================================================== */}

      <div
        data-px="footer.stage"
        className="
          relative z-10
          mx-auto w-full
          px-5 pb-0 pt-14

          sm:px-8

          lg:absolute
          lg:inset-0
          lg:p-0

          lg:[container-type:inline-size]
          lg:[--u:0.0834028357cqw]
        "
      >
        {/* ==================================================== */}
        {/* MOBILE / TABLET TOP                                  */}
        {/* ==================================================== */}

        <div
          className="
            grid grid-cols-1 gap-12

            sm:grid-cols-2

            lg:hidden
          "
        >
          <div>
            <FooterLogo />
          </div>

          <FooterColumn
            dataPx="footer.navigation.mobile"
            title="Access"
            links={navigationLinks}
          />

          <FooterColumn
            dataPx="footer.tools.mobile"
            title="Account"
            links={toolLinks}
          />

          <FooterColumn
            dataPx="footer.resources.mobile"
            title="ForexLAB"
            links={resourceLinks}
          />
        </div>

        {/* ==================================================== */}
        {/* DESKTOP TOP REGION                                   */}
        {/* ==================================================== */}

        <div
          data-px="footer.top"
          className="
            hidden

            lg:absolute
            lg:inset-0
            lg:block
          "
        >
          {/* ================================================== */}
          {/* BRAND                                              */}
          {/* ================================================== */}

          <div
            data-px="footer.brand"
            className="
              lg:absolute
              lg:left-[calc(var(--u)*114)]
              lg:top-[calc(var(--u)*122)]
            "
          >
            <FooterLogo />
          </div>

          {/* ================================================== */}
          {/* NAVIGATION                                         */}
          {/* ================================================== */}

          <div
            className="
              lg:absolute
              lg:left-[calc(var(--u)*571)]
              lg:top-[calc(var(--u)*119)]
              lg:w-[calc(var(--u)*150)]
            "
          >
            <FooterColumn
              dataPx="footer.navigation"
              title="Access"
              links={navigationLinks}
            />
          </div>

          {/* ================================================== */}
          {/* TOOLS                                              */}
          {/* ================================================== */}

          <div
            className="
              lg:absolute
              lg:left-[calc(var(--u)*772)]
              lg:top-[calc(var(--u)*119)]
              lg:w-[calc(var(--u)*150)]
            "
          >
            <FooterColumn
              dataPx="footer.tools"
              title="Account"
              links={toolLinks}
            />
          </div>

          {/* ================================================== */}
          {/* RESOURCES                                          */}
          {/* ================================================== */}

          <div
            className="
              lg:absolute
              lg:left-[calc(var(--u)*963)]
              lg:top-[calc(var(--u)*119)]
              lg:w-[calc(var(--u)*170)]
            "
          >
            <FooterColumn
              dataPx="footer.resources"
              title="ForexLAB"
              links={resourceLinks}
            />
          </div>
        </div>

        {/* ==================================================== */}
        {/* LEGAL                                                */}
        {/* ==================================================== */}

        <div
          data-px="footer.legal"
          className="
            mt-14 flex gap-[41px]

            lg:absolute
            lg:left-[calc(var(--u)*114)]
            lg:top-[calc(var(--u)*249)]
            lg:mt-0
            lg:gap-[calc(var(--u)*41)]
          "
        >
          <a
            data-px="footer.legal.privacy"
            href={links.privacy}
            className="
              whitespace-nowrap
              text-[13px]
              font-bold
              leading-none

              lg:text-[calc(var(--u)*13)]
              lg:leading-[calc(var(--u)*15)]
            "
          >
            Privacy Policy
          </a>

          <a
            data-px="footer.legal.terms"
            href={links.terms}
            className="
              whitespace-nowrap
              text-[13px]
              font-bold
              leading-none

              lg:text-[calc(var(--u)*13)]
              lg:leading-[calc(var(--u)*15)]
            "
          >
            Terms of Service
          </a>
        </div>

        {/* ==================================================== */}
        {/* GIANT WORDMARK                                       */}
        {/* ==================================================== */}

        <div
          data-px="footer.wordmark"
          aria-hidden="true"
          className="
            mt-20
            select-none
            whitespace-nowrap

            text-[105px]
            font-black
            leading-[0.78]
            tracking-[-0.07em]

            lg:absolute
            lg:left-[calc(var(--u)*106)]
            lg:top-[calc(var(--u)*328)]
            lg:mt-0

            lg:text-[calc(var(--u)*310)]
            lg:leading-[0.77]
            lg:tracking-[-0.07em]
          "
        >
          Access
        </div>
      </div>
    </footer>
  );
}

/* ============================================================ */
/* LOGO                                                         */
/* ============================================================ */

function FooterLogo() {
  return (
    <a
      data-px="footer.logo"
      href="#top"
      className="
        inline-flex items-center
        gap-[10px]

        lg:gap-[calc(var(--u)*10)]
      "
    >
      {/* Approved V2 compact horizontal logo (light-background variant). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        data-px="footer.logo.mark"
        src={asset("/brand/forexlab-access-header-light.svg")}
        alt="ForexLAB Access"
        width={332}
        height={64}
        className="
          block h-[40px] w-auto
          -ml-[8px]

          lg:-ml-[calc(var(--u)*8)]
          lg:h-[calc(var(--u)*40)]
        "
      />
    </a>
  );
}

/* ============================================================ */
/* FOOTER COLUMN                                                */
/* ============================================================ */

function FooterColumn({
  dataPx,
  title,
  links,
}: {
  dataPx: string;
  title: string;
  links: NavLink[];
}) {
  return (
    <nav data-px={dataPx}>
      <h3
        data-px={`${dataPx}.title`}
        className="
          mb-[24px]

          text-[13px]
          font-bold
          leading-none

          lg:mb-[calc(var(--u)*24)]
          lg:text-[calc(var(--u)*13)]
          lg:leading-[calc(var(--u)*13)]
        "
      >
        {title}
      </h3>

      <ul
        data-px={`${dataPx}.links`}
        className="
          space-y-[7px]

          lg:space-y-[calc(var(--u)*7)]
        "
      >
        {links.map((link, index) => (
          <li key={link.label}>
            <a
              data-px={`${dataPx}.link.${index + 1}`}
              href={link.href}
              className="
                block
                whitespace-nowrap

                text-[14px]
                leading-[16px]
                text-black

                lg:text-[calc(var(--u)*14)]
                lg:leading-[calc(var(--u)*16)]
              "
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}