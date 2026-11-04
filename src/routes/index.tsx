import { createFileRoute } from "@tanstack/react-router";
import { Mail, Sparkles, ArrowDown } from "lucide-react";
import { profile } from "@/lib/portfolio-data";
import { Reveal } from "@/hooks/use-reveal";
import { DesktopSidebar, MobileHeader } from "@/components/portfolio/Sidebar";
import { CapabilitiesSection, ServicesSection, ToolsSection, EducationSection, TrainingsSection, StrengthsSection } from "@/components/portfolio/Sections";
import { ExperienceSection } from "@/components/portfolio/Experience";
import { ContactSection } from "@/components/portfolio/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Crestine L. Asilum — Customer Service Specialist" },
      {
        name: "description",
        content:
          "Portfolio of Crestine L. Asilum, Customer Service Specialist with 17 years of customer-facing experience and 10+ years in retail operations and leadership.",
      },
      { property: "og:title", content: "Crestine L. Asilum — Customer Service Specialist" },
      {
        property: "og:description",
        content:
          "17 years of customer-facing experience. 10+ years leading retail teams. Customer service, order processing, and operational support.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

function Hero() {
  return (
    <section
      id="about"
      className="grid-paper relative scroll-mt-24 border-b border-border bg-cream/60"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-14 sm:py-20 lg:grid-cols-2">
        <Reveal>
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-lavender/70 bg-lavender/40 px-3.5 py-1.5 text-xs font-semibold tracking-widest text-lavender-deep uppercase">
              <Sparkles className="size-3.5" aria-hidden="true" />
              Hello, welcome to my portfolio
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {profile.name}
            </h1>
            <p className="mt-3 font-display text-lg text-sage-deep sm:text-xl">
              {profile.title} <span className="text-muted-foreground">|</span>{" "}
              {profile.subtitle}
            </p>
            <p className="mt-5 max-w-xl text-base font-medium text-foreground sm:text-lg">
              {profile.headline}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {profile.summary}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}?subject=${encodeURIComponent(
                  "Work inquiry — let's connect",
                )}`}
                className="flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3.5 font-display text-base font-semibold text-primary-foreground shadow-offset-sage transition-transform hover:-translate-y-0.5"
              >
                <Mail className="size-4.5" aria-hidden="true" />
                Contact Me
              </a>
              <a
                href="#experience"
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground shadow-offset transition-colors hover:border-sage/70 hover:bg-sage/10"
              >
                View Experience
                <ArrowDown className="size-4" aria-hidden="true" />
              </a>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-offset">
                <p className="font-display text-2xl font-semibold text-sage-deep">17+</p>
                <p className="text-xs text-muted-foreground">Years customer-facing roles</p>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-offset">
                <p className="font-display text-2xl font-semibold text-powder-deep">10+</p>
                <p className="text-xs text-muted-foreground">Years retail ops &amp; leadership</p>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3 shadow-offset">
                <p className="font-display text-2xl font-semibold text-lavender-deep">60</p>
                <p className="text-xs text-muted-foreground">Team members led at peak</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="relative mx-auto w-full max-w-sm">
            {/* pixel-corner accents */}
            <span
              className="absolute -top-3 -left-3 size-6 border-t-2 border-l-2 border-sage-deep"
              aria-hidden="true"
            />
            <span
              className="absolute -right-3 -bottom-3 size-6 border-r-2 border-b-2 border-lavender-deep"
              aria-hidden="true"
            />
            <div className="overflow-hidden rounded-3xl border-2 border-charcoal/10 bg-card shadow-offset-sage">
              <img
                src={profile.portrait}
                alt={`${profile.name} — ${profile.title}`}
                width={1024}
                height={1280}
                className="aspect-4/5 w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-1/2 w-max -translate-x-1/2 rounded-xl border border-border bg-card px-4 py-2.5 shadow-offset-lavender">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <span className="size-2 rounded-full bg-sage-deep" aria-hidden="true" />
                Open to new opportunities
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
        <div>
          <p className="font-display text-base font-semibold">{profile.name}</p>
          <p className="text-xs text-muted-foreground">
            {profile.title} — {profile.subtitle}
          </p>
        </div>
        <div className="flex flex-col items-center gap-1 text-xs text-muted-foreground sm:items-end">
          <a
            href={`mailto:${profile.email}`}
            className="font-medium text-foreground hover:text-sage-deep"
          >
            {profile.email}
          </a>
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileHeader />
      <main className="lg:pl-80">
        <Hero />
        <div className="mx-auto max-w-6xl px-6">
          <CapabilitiesSection />
          <ExperienceSection />
          <ServicesSection />
          <ToolsSection />
          <EducationSection />
          <TrainingsSection />
          <StrengthsSection />
          <ContactSection />
        </div>
        <Footer />
      </main>
    </div>
  );
}
