import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { experience } from "@/lib/portfolio-data";
import { Reveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

export function ExperienceSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="experience" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="03"
          title="Professional Experience"
          blurb="Seventeen years of steady growth — from front-line service to leading teams of up to 60."
        />
      </Reveal>

      <div className="relative mt-10">
        {/* timeline spine */}
        <div
          className="absolute left-[19px] top-2 bottom-2 w-px bg-border sm:left-[27px]"
          aria-hidden="true"
        />

        <ol className="space-y-5">
          {experience.map((job, i) => {
            const open = openIndex === i;
            return (
              <li key={job.company} className="relative">
                {/* timeline dot */}
                <span
                  className={`absolute left-3 top-6 z-10 size-3.5 rounded-full border-2 border-sage-deep sm:left-5 ${
                    open ? "bg-sage-deep" : "bg-background"
                  }`}
                  aria-hidden="true"
                />
                <Reveal delay={i * 60}>
                  <div
                    className={`ml-10 rounded-2xl border bg-card transition-shadow sm:ml-16 ${
                      open ? "border-sage/60 shadow-offset-sage" : "shadow-offset"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(open ? null : i)}
                      aria-expanded={open}
                      className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span>
                        <span className="block font-display text-lg font-semibold leading-snug">
                          {job.role}
                        </span>
                        <span className="mt-0.5 block text-sm font-medium text-primary">
                          {job.company}
                        </span>
                        <span className="mt-1 inline-block rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                          {job.period}
                        </span>
                      </span>
                      <ChevronDown
                        className={`mt-1 size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
                          open ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                        open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="space-y-2 border-t border-dashed border-border px-5 py-4 text-sm text-muted-foreground">
                          {job.details.map((d) => (
                            <li key={d} className="flex gap-2.5">
                              <span
                                className="mt-2 size-1.5 shrink-0 bg-lavender-deep"
                                aria-hidden="true"
                              />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
