import React, { useCallback, useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

const SECTION_LINKS = [
  { href: "#", key: "home" as const },
  { href: "/cardapio", key: "menu" as const },
  { href: "#reservations", key: "reservations" as const },
  { href: "#about", key: "about" as const },
  { href: "#contact", key: "contact" as const },
];

function scrollToSection(href: string) {
  if (href === "#" || href === "") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function StickySiteNav() {
  const { t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const go = useCallback(
    (href: string) => {
      setMobileOpen(false);

      if (href.startsWith("/")) {
        navigate(href);
        return;
      }

      if (location.pathname !== "/menu") {
        navigate(`/menu${href === "#" ? "" : href}`);
        window.setTimeout(() => scrollToSection(href), 100);
        return;
      }

      scrollToSection(href);
    },
    [location.pathname, navigate],
  );

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-[max(0.55rem,env(safe-area-inset-top))] sm:px-4">
      <div className="pointer-events-auto mx-auto max-w-screen-2xl">
        <div
          className={cn(
            "flex h-12 items-center justify-between transition-all duration-300 md:hidden",
            scrolled ? "bg-black/78 px-3 shadow-xl backdrop-blur-xl" : "bg-black/35 px-2 backdrop-blur-md",
          )}
        >
          <button
            type="button"
            onClick={() => go("#")}
            className="min-w-0 truncate font-display text-base font-semibold tracking-tight text-white"
          >
            Bella Cucina
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go("/cardapio")}
              className="hidden px-2 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-white/70 min-[390px]:block"
            >
              Cardápio
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="bg-white/10 text-white hover:bg-white/15 hover:text-white"
                  aria-label={t("nav.openMenu")}
                >
                  {mobileOpen ? <X className="h-[18px] w-[18px]" aria-hidden /> : <Menu className="h-[18px] w-[18px]" aria-hidden />}
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="flex w-[88vw] max-w-[22rem] flex-col border-l border-white/10 bg-[#0b0908] p-0 text-white">
                <SheetHeader className="px-5 pb-5 pt-6 text-left">
                  <SheetTitle className="font-display text-2xl text-white">Bella Cucina</SheetTitle>
                  <p className="mt-1 text-sm leading-6 text-white/50">Cardápio, reservas e informações da casa.</p>
                </SheetHeader>

                <nav className="flex flex-1 flex-col px-3 pb-5">
                  {SECTION_LINKS.map((link, index) => (
                    <button
                      key={link.key}
                      type="button"
                      onClick={() => go(link.href)}
                      className="grid grid-cols-[2.5rem_1fr] items-center border-t border-white/10 px-2 py-4 text-left first:border-t-0"
                    >
                      <span className="font-display text-lg text-primary">0{index + 1}</span>
                      <span className="text-base font-medium text-white">{t(`nav.${link.key}`)}</span>
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="hidden justify-center md:flex">
          <nav
            className={cn(
              "flex items-center gap-1 rounded-full px-2 py-1.5 text-white transition-all duration-300",
              scrolled ? "bg-black/78 shadow-xl backdrop-blur-xl" : "bg-black/50 backdrop-blur-lg",
            )}
            aria-label={t("nav.mobileMenuTitle")}
          >
            <button
              type="button"
              onClick={() => go("#")}
              className="mr-2 rounded-full bg-white/[0.07] px-4 py-2 font-display text-sm font-semibold text-white transition hover:bg-white/[0.11]"
            >
              Bella Cucina
            </button>

            {SECTION_LINKS.map((link) => (
              <button
                key={link.key}
                type="button"
                onClick={() => go(link.href)}
                className="rounded-full px-3.5 py-2 text-xs font-semibold text-white/65 transition hover:bg-white/[0.08] hover:text-white"
              >
                {t(`nav.${link.key}`)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
