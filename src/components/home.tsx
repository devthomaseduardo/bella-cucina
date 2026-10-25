import React from "react";

import HeroSection from "./home/HeroSection";
import GalleryStrip from "./home/GalleryStrip";
import FeaturedItems from "./home/FeaturedItems";
import MenuExperiences from "./home/MenuExperiences";
import ChefBrigadeSection from "./home/ChefBrigadeSection";
import ReservationSection from "./reservation/ReservationSection";
import Footer from "./layout/Footer";

import { CartProvider, useCart } from "./cart/CartContext";
import ToastSuccess from "./ui/toast-success";
import FloatingActions from "./layout/FloatingActions";
import { useI18n } from "@/i18n/I18nProvider";
import { StickySiteNav } from "@/components/layout/StickySiteNav";
import { motion, useReducedMotion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

const HomePageContent = () => {
  const restaurantName = "Bella Cucina";
  const { showSuccessToast, setShowSuccessToast, successMessage } = useCart();
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (!location.hash) return;

    const targetId = location.hash.slice(1);
    window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
    }, 80);
  }, [location.hash]);

  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      {showSuccessToast && (
        <ToastSuccess
          title={successMessage}
          onClose={() => setShowSuccessToast(false)}
        />
      )}

      <StickySiteNav />

      <main className="min-w-0 pt-0">
        <HeroSection
          eyebrow={t("hero.eyebrow")}
          title={t("hero.title")}
          subtitle={t("hero.subtitle")}
          backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=85"
          ctaText={t("hero.ctaMenu")}
          secondaryCtaText={t("hero.ctaReserve")}
          onCtaClick={() => navigate("/cardapio")}
          onSecondaryCtaClick={() =>
            document
              .getElementById("reservations")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        />

        <GalleryStrip />

        <FeaturedItems
          title={t("featured.title")}
          subtitle={t("featured.subtitle")}
        />

        <MenuExperiences />

        <ReservationSection
          restaurantName={restaurantName}
          restaurantImage="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80"
          title={t("reservation.sectionTitle")}
          description={t("reservation.sectionDescription")}
        />

        <ChefBrigadeSection />

        <section id="about" className="relative scroll-mt-24 overflow-hidden bg-muted/25 py-16 md:py-24">
          <div className="absolute inset-0 bella-grid-bg opacity-20" aria-hidden />
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 1, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                  {t("about.kicker")}
                </p>
                <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
                  {t("about.title")}
                </h2>
                <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                  {t("about.p1")}
                </p>

                <div className="mt-8 grid gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Produto
                    </p>
                    <p className="mt-2 font-display text-xl text-foreground">
                        {t("about.card1Title")}
                      </p>
                    </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Operação
                    </p>
                    <p className="mt-2 font-display text-xl text-foreground">
                        {t("about.card2Title")}
                      </p>
                    </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                      Experiência
                    </p>
                    <p className="mt-2 font-display text-xl text-foreground">
                        {t("about.card3Title")}
                      </p>
                    </div>
                </div>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 1, scale: 0.98 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-7"
              >
                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_90px_-56px_rgba(0,0,0,0.9)]">
                  <img
                    src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=80"
                    alt=""
                    className="h-[360px] w-full object-cover sm:h-[460px]"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/18 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                    <p className="max-w-xl text-base leading-relaxed text-white/90">
                      {t("about.quote")}
                    </p>
                    <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[hsl(var(--accent))]">
                      {t("about.chef")}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="contact" className="scroll-mt-24 bg-background py-16 md:py-24">
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 1, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="lg:col-span-5"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--accent))]">
                  {t("contact.kicker")}
                </p>
                <h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl md:text-5xl">
                  {t("contact.visitTitle")}
                </h2>
                <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
                  {t("contact.intro")}
                </p>

                <div className="mt-8 space-y-3 text-sm">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-primary">Rua</span>
                      {t("contact.address")}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Rua Principal, 123, Cidade, Estado 12345
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                      <p className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-primary">Tel</span>
                        {t("contact.phone")}
                      </p>
                      <p className="mt-1 text-muted-foreground">(11) 1234-5678</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                      <p className="flex items-center gap-2 font-semibold text-foreground">
                        <span className="text-[10px] uppercase tracking-[0.18em] text-primary">Mail</span>
                        {t("contact.email")}
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        contato@bellacucina.com
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-4">
                    <p className="flex items-center gap-2 font-semibold text-foreground">
                      <span className="text-[10px] uppercase tracking-[0.18em] text-primary">Hora</span>
                      {t("contact.hours")}
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      Segunda a quinta, 11:00 às 22:00
                    </p>
                    <p className="text-muted-foreground">
                      Sexta e sábado, 11:00 às 23:00 · Domingo, 12:00 às 21:00
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={shouldReduceMotion ? false : { opacity: 1, scale: 0.98 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.045] shadow-[0_24px_90px_-56px_rgba(0,0,0,0.9)] lg:col-span-7"
              >
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 pr-20 sm:pr-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      Localização
                    </p>
                    <p className="mt-1 font-display text-xl text-foreground">
                      Jardins, São Paulo
                    </p>
                  </div>
                  <span className="rounded-full border border-primary/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Mapa
                  </span>
                </div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.1775656636577!2d-46.6585407!3d-23.5646162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzUyLjYiUyA0NsKwMzknMzAuNyJX!5e0!3m2!1spt-BR!2sbr!4v1620151913177!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  className="min-h-[360px] w-full sm:min-h-[430px]"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Mapa do restaurante"
                />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        restaurantName={restaurantName}
        address="Rua Principal, 123, Cidade, Estado 12345"
        phone="(11) 1234-5678"
        email="contato@bellacucina.com"
      />

      <FloatingActions showWaiterAction={false} />
    </div>
  );
};

const HomePage = () => {
  return (
    <CartProvider>
      <HomePageContent />
    </CartProvider>
  );
};

export default HomePage;
