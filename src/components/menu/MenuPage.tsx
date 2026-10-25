import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import MenuSection from "@/components/menu/MenuSection";
import { CartProvider } from "@/components/cart/CartContext";
import FloatingActions from "@/components/layout/FloatingActions";
import { StickySiteNav } from "@/components/layout/StickySiteNav";
import Footer from "@/components/layout/Footer";

const MenuPageContent = () => {
  return (
    <div className="min-h-screen w-full min-w-0 overflow-x-hidden bg-background">
      <StickySiteNav />

      <main className="min-w-0 pt-20 sm:pt-24">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/menu"
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" aria-hidden />
            Voltar ao início
          </Link>
        </div>

        <section id="menu" className="scroll-mt-20">
          <MenuSection />
        </section>
      </main>

      <Footer />

      <FloatingActions showWaiterAction={false} />
    </div>
  );
};

const MenuPage = () => (
  <CartProvider>
    <MenuPageContent />
  </CartProvider>
);

export default MenuPage;
