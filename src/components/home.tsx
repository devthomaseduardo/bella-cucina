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
import VisitSection from "./home/VisitSection";
import { useI18n } from "@/i18n/I18nProvider";
import { StickySiteNav } from "@/components/layout/StickySiteNav";
import { useLocation, useNavigate } from "react-router-dom";

const HomePageContent = () => {
  const restaurantName = "Bella Cucina";
  const { showSuccessToast, setShowSuccessToast, successMessage } = useCart();
  const { t } = useI18n();
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

        <VisitSection />
      </main>

      <Footer />

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
