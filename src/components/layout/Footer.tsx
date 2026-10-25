import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

import { RESTAURANT } from "@/data/restaurant";

// Address, hours and map live in the "Visite-nos" section; the footer stays short.
const Footer = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-[#080706] px-4 py-10 text-white sm:px-6 sm:pb-36 md:px-8">
      <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-display text-3xl">{RESTAURANT.name}</p>
          <p className="mt-2 text-sm text-white/55">
            {RESTAURANT.neighborhood} · {RESTAURANT.phone}
          </p>
          <Link
            to="/menu#reservations"
            className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-primary"
          >
            Reservar mesa
            <ArrowUpRight
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              aria-hidden
            />
          </Link>
        </div>

        <nav aria-label="Navegação do rodapé" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <Link to="/menu" className="text-white/65 transition hover:text-white">Início</Link>
          <Link to="/cardapio" className="text-white/65 transition hover:text-white">Cardápio</Link>
          <Link to="/menu#reservations" className="text-white/65 transition hover:text-white">Reservas</Link>
          <Link to="/menu#contact" className="text-white/65 transition hover:text-white">Como chegar</Link>
        </nav>
      </div>

      <p className="mx-auto mt-8 max-w-screen-2xl border-t border-white/10 pt-6 text-xs text-white/40">
        © {new Date().getFullYear()} {RESTAURANT.name}
      </p>
    </footer>
  );
};

export default Footer;
