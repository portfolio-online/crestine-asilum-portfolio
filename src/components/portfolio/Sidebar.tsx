import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Menu, X, ArrowUpRight, FileDown, UserRoundCog } from "lucide-react";
import { usePortfolioData } from "@/lib/use-portfolio-data";

export const navItems = [
  { id: "about", label: "About Me" },
  { id: "capabilities", label: "Core Capabilities" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "tools", label: "Tools & Skills" },
  { id: "work-samples", label: "Work Samples" },
  { id: "education", label: "Education" },
  { id: "training", label: "Trainings" },
  { id: "strengths", label: "Strengths" },
  { id: "contact", label: "Work With Me" },
];

/** Highlights the nav link of the section currently in view. */
function useScrollSpy() {
  const [active, setActive] = useState("about");

  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-30% 0px -55% 0px", threshold: [0, 0.2, 0.5] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return active;
}

function ProfileBlock({ onAdminClick }: { onAdminClick: () => void }) {
  const { profile } = usePortfolioData();

  return (
    <div>
      <button
        type="button"
        onClick={onAdminClick}
        aria-label="Open profile manager"
        title="Open profile manager"
        className="mx-auto block size-20 overflow-hidden rounded-full border-2 border-sage/60 shadow-offset-sage transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <img
          src={profile.sidebarImage || "/profile.jpg"}
          alt=""
          className="size-full object-cover"
        />
      </button>
      <div className="mt-5 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {profile.name}
        </h1>
        <p className="mt-1 text-sm font-medium text-primary">{profile.title}</p>
        <p className="text-xs text-muted-foreground">{profile.subtitle}</p>
      </div>
    </div>
  );
}

function ContactShortcuts() {
  const { profile } = usePortfolioData();
  const items = [
    { icon: Mail, href: `mailto:${profile.email}`, label: profile.email },
    { icon: Phone, href: `tel:${profile.phoneHref}`, label: profile.phone },
    {
      icon: MapPin,
      href: `https://maps.google.com/?q=Camalig,Albay,Philippines`,
      label: profile.location,
    },
  ];
  return (
    <ul className="space-y-2 text-xs">
      {items.map(({ icon: Icon, href, label }) => (
        <li key={label}>
          <a
            href={href}
            className="group flex items-center gap-2 rounded-lg border border-transparent px-2 py-1.5 text-muted-foreground transition-colors hover:border-border hover:bg-muted hover:text-foreground"
          >
            <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">{label}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: (typeof navItems)[number];
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${item.id}`}
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-sage/25 font-semibold text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <span
        className={`size-2 shrink-0 border transition-colors ${
          active ? "border-sage-deep bg-sage-deep" : "border-sage-deep/40"
        }`}
        aria-hidden="true"
      />
      {item.label}
    </a>
  );
}

const MIN_SIDEBAR_WIDTH = 220;
const MAX_SIDEBAR_WIDTH = 400;

export function DesktopSidebar({
  width,
  onWidthChange,
  onAdminClick,
}: {
  width: number;
  onWidthChange: (width: number) => void;
  onAdminClick: () => void;
}) {
  const active = useScrollSpy();

  return (
    <aside
      style={{ width }}
      className="fixed inset-y-0 left-0 z-40 hidden flex-col gap-8 overflow-y-auto border-r border-border bg-card px-6 py-8 lg:flex"
    >
      <ProfileBlock onAdminClick={onAdminClick} />
      <ContactShortcuts />
      <button
        type="button"
        onClick={onAdminClick}
        className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-sage/70 hover:bg-sage/10"
      >
        <UserRoundCog className="size-4 text-primary" aria-hidden="true" />
        Edit Profile
      </button>
      <a
        href="/resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:brightness-95"
      >
        <FileDown className="size-4" aria-hidden="true" />
        View Resume
      </a>
      <nav aria-label="Sections" className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.id} item={item} active={active === item.id} />
        ))}
      </nav>
      <div
        role="separator"
        aria-label="Resize sidebar"
        aria-orientation="vertical"
        aria-valuemin={MIN_SIDEBAR_WIDTH}
        aria-valuemax={MAX_SIDEBAR_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        onPointerDown={(event) => event.currentTarget.setPointerCapture(event.pointerId)}
        onPointerMove={(event) => {
          if (event.buttons !== 1) return;
          onWidthChange(Math.min(MAX_SIDEBAR_WIDTH, Math.max(MIN_SIDEBAR_WIDTH, event.clientX)));
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            onWidthChange(Math.max(MIN_SIDEBAR_WIDTH, width - 16));
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            onWidthChange(Math.min(MAX_SIDEBAR_WIDTH, width + 16));
          } else if (event.key === "Home") {
            event.preventDefault();
            onWidthChange(MIN_SIDEBAR_WIDTH);
          } else if (event.key === "End") {
            event.preventDefault();
            onWidthChange(MAX_SIDEBAR_WIDTH);
          }
        }}
        className="absolute inset-y-0 right-0 z-10 flex w-2 cursor-col-resize touch-none items-center justify-center outline-none after:h-12 after:w-1 after:rounded-full after:bg-border after:transition-colors hover:after:bg-primary focus-visible:after:bg-primary"
      />
    </aside>
  );
}

export function MobileHeader({ onAdminClick }: { onAdminClick: () => void }) {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy();
  const { profile } = usePortfolioData();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onAdminClick}
            aria-label="Open profile manager"
            className="size-10 shrink-0 overflow-hidden rounded-full border border-sage/70"
          >
            <img
              src={profile.sidebarImage || "/profile.jpg"}
              alt=""
              className="size-full object-cover"
            />
          </button>
          <div>
            <p className="font-display text-sm font-semibold leading-tight">{profile.name}</p>
            <p className="text-xs text-muted-foreground">{profile.title}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-lg border border-border bg-background p-2 hover:bg-muted"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav aria-label="Sections" className="border-t border-border bg-card px-4 py-3">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.id}
                item={item}
                active={active === item.id}
                onClick={() => setOpen(false)}
              />
            ))}
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Contact Me <ArrowUpRight className="size-4" />
          </a>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onAdminClick();
              }}
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold"
            >
              <UserRoundCog className="size-4" aria-hidden="true" /> Edit Profile
            </button>
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold"
            >
              <FileDown className="size-4" aria-hidden="true" /> Resume
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
