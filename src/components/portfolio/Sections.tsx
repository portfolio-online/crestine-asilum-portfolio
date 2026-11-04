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
  type LucideIcon,
} from "lucide-react";
import {
  capabilities,
  services,
  toolCategories,
  education,
  trainings,
  strengths,
} from "@/lib/portfolio-data";
import { Reveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

/* Pastel accent cycle: sage → powder → lavender */
const accentCycle = [
  { badge: "border-sage/70 bg-sage/15 text-sage-deep", chip: "bg-sage/20" },
  { badge: "border-powder/70 bg-powder/40 text-powder-deep", chip: "bg-powder/60" },
  { badge: "border-lavender/70 bg-lavender/40 text-lavender-deep", chip: "bg-lavender/60" },
] as const;

const accent = (i: number) => accentCycle[i % accentCycle.length];

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
          const Icon = capabilityIcons[i % capabilityIcons.length];
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
          const Icon = serviceIcons[i % serviceIcons.length];
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
                <h3 className="font-display text-lg font-semibold leading-snug">
                  {service.title}
                </h3>
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

export function ToolsSection() {
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
          const Icon = toolIcons[i % toolIcons.length];
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
                    <li
                      key={item}
                      className={`rounded-md border border-border px-2.5 py-1 text-xs font-medium ${a.badge}`}
                    >
                      {item}
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

/* ---------------- Education ---------------- */

export function EducationSection() {
  return (
    <section id="education" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading index="06" title="Education" />
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
  return (
    <section id="training" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading index="07" title="Trainings & Certifications" />
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
  return (
    <section id="strengths" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="08"
          title="Professional Strengths"
          blurb="How I work — and what colleagues and customers can count on."
        />
      </Reveal>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {strengths.map((s, i) => {
          const Icon = strengthIcons[i % strengthIcons.length];
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
