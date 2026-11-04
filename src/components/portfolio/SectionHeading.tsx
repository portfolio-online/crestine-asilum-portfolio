import type { ReactNode } from "react";

/** Shared section header: numbered eyebrow chip, serif title, short blurb. */
export function SectionHeading({
  index,
  title,
  blurb,
  action,
}: {
  index: string;
  title: string;
  blurb?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <span className="inline-flex items-center gap-2 rounded-full border border-sage/60 bg-sage/15 px-3 py-1 text-xs font-semibold tracking-widest text-sage-deep uppercase">
          <span className="size-1.5 bg-sage-deep" aria-hidden="true" />
          {index}
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>
        {blurb && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{blurb}</p>
        )}
      </div>
      {action}
    </div>
  );
}
