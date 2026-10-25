import React, { useEffect, useState } from "react";
import { ArrowRight, Clock, Menu, Phone, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RESTAURANT, hoursForDay } from "@/data/restaurant";
import { useI18n } from "@/i18n/I18nProvider";
import type { SupportedLanguage } from "@/i18n/types";
import { cn } from "@/lib/utils";

type NavLink = {
  key: "menu" | "experiences" | "cucina" | "visit";
  /** Route for pages, or a section id on the home page. */
  to: string;
  section?: string;
};

// The logo already goes home, so there is no "Início" link; booking is the single CTA.
const NAV_LINKS: NavLink[] = [
  { key: "menu", to: "/cardapio" },
  { key: "experiences", to: "/menu#esperienze", section: "esperienze" },
  { key: "cucina", to: "/menu#cucina", section: "cucina" },
  { key: "visit", to: "/menu#contact", section: "contact" },
];

const LANGUAGES: { code: SupportedLanguage; name: string }[] = [
  { code: "pt", name: "Português" },
  { code: "en", name: "English" },
  { code: "it", name: "Italiano" },
];
const HOME_PATH = "/menu";

/** Shows the bar again when scrolling up; hides it when scrolling down past the hero. */
function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false });

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const goingDown = y > lastY;
      setState({ scrolled: y > 24, hidden: goingDown && y > 480 });
      lastY = y;
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}

/** Id of the home section currently in view (scroll-spy). */
function useActiveSection(enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const ids = NAV_LINKS.flatMap((link) => (link.section ? [link.section] : []));
    const elements = ids.flatMap((id) => {
      const element = document.getElementById(id);
      return element ? [element] : [];
    });
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
        else if (window.scrollY < window.innerHeight * 0.5) setActive(null);
      },
      // A section counts as active while it crosses the middle band of the screen.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [enabled]);

  return active;
}

function LanguageSwitch({ className }: { className?: string }) {
  const { language, setLanguage, t } = useI18n();
  return (
    <div role="group" aria-label={t("nav.language")} className={cn("flex items-center rounded-full bg-white/[0.06] p-0.5", className)}>
      {LANGUAGES.map(({ code, name }) => (
        <button
          key={code}
          type="button"
          lang={code}
          onClick={() => setLanguage(code)}
          aria-pressed={language === code}
          aria-label={name}
          className={cn(
            "h-8 min-w-9 rounded-full px-2 text-xs font-semibold uppercase transition",
            language === code ? "bg-white text-black" : "text-white/60 hover:text-white",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}

export function StickySiteNav() {
  const { t } = useI18n();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrolled, hidden } = useScrollState();
  const onHome = location.pathname === HOME_PATH;
  const activeSection = useActiveSection(onHome);
  const today = hoursForDay();

  const isActive = (link: NavLink) =>
    link.section ? onHome && activeSection === link.section : location.pathname === link.to;

  /** Same-page section links scroll smoothly; everything else is a normal route change. */
  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>, link: NavLink) => {
    setMobileOpen(false);
    if (!link.section || !onHome) return;
    const target = document.getElementById(link.section);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${link.section}`);
  };

  const goReserve = () => {
    setMobileOpen(false);
    if (onHome) document.getElementById("reservations")?.scrollIntoView({ behavior: "smooth" });
    else navigate(`${HOME_PATH}#reservations`);
  };

  const barVisible = !hidden || mobileOpen;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,box-shadow] duration-300",
        barVisible ? "translate-y-0" : "-translate-y-full",
        scrolled
          ? "border-b border-white/10 bg-[#0b0706]/85 shadow-[0_12px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl"
          : "bg-gradient-to-b from-black/60 to-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-screen-2xl items-center gap-4 px-4 pt-[env(safe-area-inset-top)] sm:px-6 lg:h-20 lg:px-8">
        <Link
          to={HOME_PATH}
          onClick={(event) => {
            setMobileOpen(false);
            if (onHome) {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
          className="mr-auto font-display text-xl font-semibold tracking-tight text-white lg:text-2xl"
        >
          Bella <span className="italic text-[hsl(var(--accent))]">Cucina</span>
        </Link>

        {/* Desktop links */}
        <nav aria-label={t("nav.mobileMenuTitle")} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = isActive(link);
              return (
                <li key={link.key}>
                  <Link
                    to={link.to}
                    onClick={(event) => handleClick(event, link)}
                    aria-current={active ? (link.section ? "location" : "page") : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 text-sm font-medium transition",
                      active ? "text-white" : "text-white/65 hover:text-white",
                    )}
                  >
                    {t(`nav.${link.key}`)}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-4 -bottom-0.5 h-px origin-left bg-[hsl(var(--accent))] transition-transform duration-300",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <LanguageSwitch className="hidden lg:flex" />

        <Button size="sm" onClick={goReserve} className="hidden sm:inline-flex lg:h-10">
          {t("nav.reserve")}
        </Button>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="bg-white/10 text-white hover:bg-white/15 hover:text-white lg:hidden"
              aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            >
              {mobileOpen ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="flex w-[88vw] max-w-sm flex-col border-l border-white/10 bg-[#0b0706] p-0 text-white"
          >
            <SheetHeader className="flex-row items-center justify-between space-y-0 px-5 pb-4 pt-6 text-left">
              <SheetTitle className="font-display text-2xl text-white">
                Bella <span className="italic text-[hsl(var(--accent))]">Cucina</span>
              </SheetTitle>
              <LanguageSwitch className="mr-10" />
            </SheetHeader>

            <nav aria-label={t("nav.mobileMenuTitle")} className="flex-1 overflow-y-auto px-5">
              <ul className="border-t border-white/10">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link);
                  return (
                    <li key={link.key} className="border-b border-white/10">
                      <SheetClose asChild>
                        <Link
                          to={link.to}
                          onClick={(event) => handleClick(event, link)}
                          aria-current={active ? (link.section ? "location" : "page") : undefined}
                          className="flex items-center justify-between py-4 font-display text-2xl text-white"
                        >
                          {t(`nav.${link.key}`)}
                          {active ? (
                            <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" aria-hidden />
                          ) : (
                            <ArrowRight className="h-5 w-5 text-white/30" aria-hidden />
                          )}
                        </Link>
                      </SheetClose>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="space-y-4 border-t border-white/10 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden />
                  {today ? `${t("nav.todayHours")}: ${today.opens} às ${today.closes}` : t("nav.closedToday")}
                </span>
                <a href={`tel:+55${RESTAURANT.phone.replace(/\D/g, "")}`} className="inline-flex items-center gap-2 hover:text-white">
                  <Phone className="h-4 w-4 text-[hsl(var(--accent))]" aria-hidden />
                  {RESTAURANT.phone}
                </a>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <SheetClose asChild>
                  <Button asChild variant="outline" className="border-white/20 text-white hover:text-white">
                    <Link to="/cardapio">{t("nav.menu")}</Link>
                  </Button>
                </SheetClose>
                <Button onClick={goReserve}>{t("nav.reserve")}</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
