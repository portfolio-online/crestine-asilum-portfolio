import {
  MessagesSquare,
  PackageCheck,
  LifeBuoy,
  ArrowUpCircle,
  ClipboardCheck,
  Users,
  Workflow,
  Truck,
  FileCheck,
  Mail,
  PackageSearch,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  Table,
  Table2,
  Database,
  FolderOpen,
  GraduationCap,
  BadgeCheck,
  MessageCircle,
  ListChecks,
  Lightbulb,
  Eye,
  Layers,
  HeartHandshake,
  Search,
  ShoppingCart,
  CalendarDays,
  FileText,
  BriefcaseBusiness,
  type LucideIcon,
} from "lucide-react";
import { usePortfolioData } from "@/lib/use-portfolio-data";
import { Reveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

/* Pastel accent cycle: sage → powder → lavender */
const accentCycle = [
  { badge: "border-sage/70 bg-sage/15 text-sage-deep", chip: "bg-sage/20" },
  { badge: "border-powder/70 bg-powder/40 text-powder-deep", chip: "bg-powder/60" },
  { badge: "border-lavender/70 bg-lavender/40 text-lavender-deep", chip: "bg-lavender/60" },
] as const;

type Accent = (typeof accentCycle)[number];

/** Picks list[i % len] with a guaranteed fallback (strict index access). */
function at<T>(list: readonly T[], i: number): T {
  const item = list[i % list.length];
  const first = list[0] as T;
  return item ?? first;
}

const accent = (i: number): Accent => at(accentCycle, i);

/* ---------------- Capabilities ---------------- */

const capabilityIcons: LucideIcon[] = [
  MessagesSquare,
  PackageCheck,
  LifeBuoy,
  ArrowUpCircle,
  ClipboardCheck,
  Users,
  Workflow,
  Truck,
  FileCheck,
];

export function CapabilitiesSection() {
  const { capabilities } = usePortfolioData();

  return (
    <section id="capabilities" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="02"
          title="Core Capabilities"
          blurb="The skills I bring to every customer, every order, and every team I work with."
        />
      </Reveal>
      <div className="mt-8 flex flex-wrap gap-3">
        {capabilities.map((cap, i) => {
          const Icon = at(capabilityIcons, i);
          const a = accent(i);
          return (
            <Reveal key={cap} delay={(i % 3) * 70}>
              <span
                className={`flex items-center gap-2.5 rounded-full border-2 px-4 py-2.5 text-sm font-medium transition-transform hover:-translate-y-0.5 ${a.badge}`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {cap}
              </span>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Services ---------------- */

const serviceIcons: LucideIcon[] = [
  Mail,
  PackageSearch,
  ShieldCheck,
  ClipboardList,
  BarChart3,
  LifeBuoy,
  Table,
  Users,
];

export function ServicesSection() {
  const { services } = usePortfolioData();

  return (
    <section id="services" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="04"
          title="Services"
          blurb="Practical, dependable support you can hand over with confidence."
        />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {services.map((service, i) => {
          const Icon = at(serviceIcons, i);
          const a = accent(i);
          return (
            <Reveal key={service.title} delay={(i % 3) * 70}>
              <article
                className={`group relative h-full rounded-2xl border bg-card p-5 shadow-offset hover-lift hover:shadow-offset-sage ${a.chip}`}
              >
                <div
                  className={`mb-4 inline-flex size-11 items-center justify-center rounded-xl border-2 border-border bg-card ${a.badge}`}
                >
                  <Icon className="size-5" aria-hidden="true" />
                </div>
                <h3 className="font-display text-lg font-semibold leading-snug">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{service.description}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- Tools & Technical Skills ---------------- */

const toolIcons: LucideIcon[] = [Table2, Database, Mail, FolderOpen, BarChart3];
const toolItemIcons: Record<string, LucideIcon> = {
  "Microsoft Excel": Table2,
  "Google Sheets": Table,
  VLOOKUP: Search,
  "Data Validation": BadgeCheck,
  SAP: Database,
  POS: ShoppingCart,
  S4DECS: Database,
  "IVS / Invoicing": ClipboardList,
  Gmail: Mail,
  Outlook: Mail,
  "Calendar Management": CalendarDays,
  "Google Drive": FolderOpen,
  "Google Docs": FileText,
  "Microsoft Office": BriefcaseBusiness,
  "Business Intelligence": BarChart3,
  "Operational Reporting Tools": ClipboardList,
};

export function ToolsSection() {
  const { profile, toolCategories } = usePortfolioData();
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email,
  )}`;

  return (
    <section id="tools" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="05"
          title="Tools & Technical Skills"
          blurb="Systems and software I work in every day."
        />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {toolCategories.map((cat, i) => {
          const Icon = at(toolIcons, i);
          const a = accent(i);
          return (
            <Reveal key={cat.label} delay={(i % 3) * 70}>
              <article className="relative h-full rounded-2xl border bg-card p-5 shadow-offset hover-lift">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-xl border-2 ${a.badge}`}
                  >
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-lg font-semibold">{cat.label}</h3>
                </div>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.items.map((item) => (
                    <li key={item}>
                      {item === "Gmail" ? (
                        <a
                          href={gmailUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium transition-colors hover:brightness-95 ${a.badge}`}
                        >
                          <Mail className="size-3.5" aria-hidden="true" />
                          {item}
                        </a>
                      ) : (
                        <ToolSkill item={item} badgeClass={a.badge} />
                      )}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

function ToolSkill({ item, badgeClass }: { item: string; badgeClass: string }) {
  const Icon = toolItemIcons[item];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1 text-xs font-medium ${badgeClass}`}
    >
      {Icon && <Icon className="size-3.5" aria-hidden="true" />}
      {item}
    </span>
  );
}

/* ---------------- Work Samples ---------------- */

export function WorkSamplesSection() {
  const { workSamples } = usePortfolioData();

  return (
    <section id="work-samples" aria-label="Work Samples" className="min-h-64 scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading index="06" title="Work Samples" />
      </Reveal>
      {workSamples.length ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {workSamples.map((sample) => (
            <article
              key={`${sample.title}-${sample.attachment.name}`}
              className="rounded-2xl border bg-card p-5 shadow-offset hover-lift"
            >
              <h3 className="font-display text-lg font-semibold">{sample.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{sample.description}</p>
              {sample.attachment.dataUrl && (
                <a
                  href={sample.attachment.dataUrl}
                  download={sample.attachment.name}
                  className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
                >
                  Download {sample.attachment.name}
                  <span className="sr-only"> for {sample.title}</span>
                </a>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-5 max-w-xl text-sm text-muted-foreground">
          Work samples will be added here.
        </p>
      )}
    </section>
  );
}

/* ---------------- Education ---------------- */

export function EducationSection() {
  const { education } = usePortfolioData();

  return (
    <section id="education" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading index="07" title="Education" />
      </Reveal>
      <Reveal delay={80}>
        <article className="mt-8 flex items-start gap-5 rounded-2xl border bg-card p-6 shadow-offset-sage">
          <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl border-2 border-sage/70 bg-sage/15 text-sage-deep">
            <GraduationCap className="size-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display text-xl font-semibold">{education.school}</h3>
            <p className="mt-1 text-sm font-medium text-foreground">{education.degree}</p>
            <p className="text-sm text-muted-foreground">{education.major}</p>
            <span className="mt-3 inline-block rounded-md bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
              {education.period}
            </span>
          </div>
        </article>
      </Reveal>
    </section>
  );
}

/* ---------------- Trainings & Certifications ---------------- */

export function TrainingsSection() {
  const { trainings } = usePortfolioData();

  return (
    <section id="training" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading index="08" title="Trainings & Certifications" />
      </Reveal>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {trainings.map((t, i) => {
          const a = accent(i);
          return (
            <Reveal key={t.name} delay={(i % 2) * 70}>
              <li
                className={`flex items-center gap-3 rounded-xl border bg-card px-4 py-3.5 shadow-offset hover-lift ${a.badge}`}
              >
                <BadgeCheck className="size-5 shrink-0" aria-hidden="true" />
                <span className="text-sm font-medium text-foreground">{t.name}</span>
                {t.year && (
                  <span className="ml-auto rounded-md bg-background px-2 py-0.5 text-xs font-semibold">
                    {t.year}
                  </span>
                )}
              </li>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------------- Professional Strengths ---------------- */

const strengthIcons: LucideIcon[] = [
  MessageCircle,
  ListChecks,
  Lightbulb,
  Eye,
  Users,
  Layers,
  HeartHandshake,
];

export function StrengthsSection() {
  const { strengths } = usePortfolioData();

  return (
    <section id="strengths" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="09"
          title="Professional Strengths"
          blurb="How I work — and what colleagues and customers can count on."
        />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {strengths.map((s, i) => {
          const Icon = at(strengthIcons, i);
          const a = accent(i);
          return (
            <Reveal key={s.title} delay={(i % 3) * 70}>
              <article
                className={`relative h-full rounded-2xl border bg-card p-5 shadow-offset hover-lift ${a.chip}`}
              >
                <span
                  className={`mb-4 inline-flex size-10 items-center justify-center rounded-xl border-2 bg-card ${a.badge}`}
                >
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-base font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.note}</p>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
