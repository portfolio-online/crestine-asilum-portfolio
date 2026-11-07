import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
import { usePortfolioData } from "@/lib/use-portfolio-data";
import { Reveal } from "@/hooks/use-reveal";
import { SectionHeading } from "./SectionHeading";

export function ContactSection() {
  const { profile } = usePortfolioData();
  const contactRows = [
    {
      icon: Mail,
      label: "Email",
      value: profile.email,
      href: `mailto:${profile.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: profile.phone,
      href: `tel:${profile.phoneHref}`,
    },
    {
      icon: MapPin,
      label: "Location",
      value: profile.location,
      href: "https://maps.google.com/?q=Camalig,Albay,Philippines",
    },
  ];
  const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    profile.email,
  )}&su=${encodeURIComponent("Work inquiry — let's get started")}`;

  return (
    <section id="contact" className="scroll-mt-24 py-14">
      <Reveal>
        <SectionHeading
          index="10"
          title="Work With Me"
          blurb="Looking for dependable customer service and operational support? I'd love to hear from you."
        />
      </Reveal>

      <div className="mt-10 grid gap-6 lg:grid-cols-5">
        {/* Portrait */}
        <Reveal className="lg:col-span-2">
          <div className="grid-paper relative flex aspect-4/5 items-center justify-center overflow-hidden rounded-3xl border-2 border-charcoal/10 bg-sage/15 shadow-offset-lavender">
            <img
              src={profile.contactImage || "/profile.jpg"}
              alt={profile.name}
              className="size-full object-cover object-center"
            />
            <div className="absolute bottom-4 left-4 rounded-xl border border-border bg-card/95 px-4 py-2.5 shadow-offset">
              <p className="font-display text-sm font-semibold">{profile.name}</p>
              <p className="text-xs text-muted-foreground">{profile.title}</p>
            </div>
          </div>
        </Reveal>

        {/* Details */}
        <Reveal delay={80} className="lg:col-span-3">
          <div className="flex h-full flex-col gap-4 rounded-2xl border bg-card p-6 shadow-offset sm:p-8">
            <ul className="space-y-4">
              {contactRows.map(({ icon: Icon, label, value, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-4 rounded-xl border border-border px-4 py-3.5 transition-colors hover:border-sage/70 hover:bg-sage/10"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-sage/70 bg-sage/15 text-sage-deep">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                        {label}
                      </span>
                      <span className="block truncate text-sm font-medium group-hover:text-sage-deep">
                        {value}
                      </span>
                    </span>
                    <ArrowUpRight className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sage-deep" />
                  </a>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-4">
              <a
                href={composeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2.5 rounded-xl bg-primary px-6 py-4 text-center font-display text-lg font-semibold text-primary-foreground shadow-offset-sage transition-transform hover:-translate-y-0.5"
              >
                <Mail className="size-5" aria-hidden="true" />
                Email Me to Get Started
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Opens a new Gmail tab so you can write your message.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
