"use client";

import { useId, useState, type ReactNode } from "react";

export type FaqItem = { question: string; answer: ReactNode };

/**
 * Vertical accordion: native buttons with aria-expanded / aria-controls (Enter and
 * Space toggle, Tab moves between questions). Closed answers are inert, so their links
 * are not focusable. The height transition is short and disabled for reduced motion.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<ReadonlySet<number>>(() => new Set([0]));
  const baseId = useId();

  const toggle = (index: number) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });

  return (
    <ul data-px="learning.accordion" className="border-b border-black/10">
      {items.map((item, index) => {
        const isOpen = open.has(index);
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <li key={item.question} className="border-t border-black/10">
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="
                  group flex w-full items-center justify-between gap-6
                  py-[18px] text-left
                  text-[15px] font-bold leading-[21px] text-black
                  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2A4FD8]
                  lg:py-[calc(var(--u)*19)]
                  lg:text-[calc(var(--u)*15)]
                  lg:leading-[calc(var(--u)*21)]
                "
              >
                <span>{item.question}</span>
                <span
                  aria-hidden="true"
                  className={`
                    relative grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full border
                    transition-colors duration-200 motion-reduce:transition-none
                    lg:h-[calc(var(--u)*22)] lg:w-[calc(var(--u)*22)]
                    ${isOpen ? "border-[#2A4FD8] text-[#2A4FD8]" : "border-black/20 text-black group-hover:border-black/45"}
                  `}
                >
                  <span className="absolute h-[1.5px] w-[9px] rounded-full bg-current lg:w-[calc(var(--u)*9)]" />
                  <span
                    className={`
                      absolute h-[9px] w-[1.5px] rounded-full bg-current
                      transition-transform duration-200 motion-reduce:transition-none
                      lg:h-[calc(var(--u)*9)]
                      ${isOpen ? "scale-y-0" : "scale-y-100"}
                    `}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`
                grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none
                ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
            >
              <div className="overflow-hidden">
                <div
                  className="
                    mb-[18px] rounded-[8px] bg-[#f4f4f6] px-4 py-[14px]
                    text-[14px] leading-[22px] text-[#3f3f46]
                    lg:mb-[calc(var(--u)*19)]
                    lg:rounded-[calc(var(--u)*8)]
                    lg:px-[calc(var(--u)*18)] lg:py-[calc(var(--u)*15)]
                    lg:text-[calc(var(--u)*13.5)] lg:leading-[calc(var(--u)*21)]
                  "
                >
                  {item.answer}
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
