import { useEffect, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { profile } from "@/lib/portfolio-data";

export const navItems = [
  { id: "about", label: "About Me" },
  { id: "capabilities", label: "Core Capabilities" },
  { id: "experience", label: "Experience" },
  { id: "services", label: "Services" },
  { id: "tools", label: "Tools & Skills" },
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

function ProfileBlock() {
  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-3xl border-2 border-charcoal/10 shadow-offset-sage">
        <img
          src={profile.portrait}
          alt={`${profile.name} — ${profile.title}`}
          width={1024}
          height={1280}
          className="aspect-4/5 w-full object-cover"
        />
      </div>
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
  const items = [
    { icon: Mail, href: `mailto:${profile.email}`, label: profile.email },
    { icon: Phone, href: `tel:${profile.phoneHref}`, label: profile.phone },
    { icon: MapPin, href: `https://maps.google.com/?q=Camalig,Albay,Philippines`, label: profile.location },
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

export function DesktopSidebar() {
  const active = useScrollSpy();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col gap-8 overflow-y-auto border-r border-border bg-card px-7 py-10 lg:flex">
      <ProfileBlock />
      <ContactShortcuts />
      <nav aria-label="Sections" className="flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink key={item.id} item={item} active={active === item.id} />
        ))}
      </nav>
    </aside>
  );
}

export function MobileHeader() {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src={profile.portrait}
            alt=""
            width={80}
            height={100}
            className="size-10 rounded-full border border-border object-cover"
          />
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
        </nav>
      )}
    </header>
  );
}
