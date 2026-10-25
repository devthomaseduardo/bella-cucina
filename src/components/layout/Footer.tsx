import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

interface FooterProps {
  restaurantName?: string;
  address?: string;
  phone?: string;
  email?: string;
}

const Footer = ({
  restaurantName = "Bella Cucina",
  address = "Jardins, São Paulo",
  phone = "(11) 1234-5678",
  email = "contato@bellacucina.com",
}: FooterProps) => {
  return (
    <footer className="w-full bg-[#080706] px-4 pb-8 pt-14 text-white sm:px-6 sm:pt-16 md:px-8 md:pt-20">
      <div className="mx-auto max-w-screen-2xl">
        <div className="grid gap-10 border-b border-white/10 pb-12 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Bella Cucina</p>
            <h2 className="mt-4 max-w-[12ch] font-display text-4xl leading-[0.96] text-white sm:text-5xl md:text-6xl">
              Uma mesa, uma noite, menos ruído.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
              Cardápio digital, reservas e atendimento pensados para deixar a tecnologia no lugar certo: apoiando a experiência.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <Link
              to="/menu#reservations"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-primary"
            >
              Reservar uma mesa
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">Local</p>
            <p className="mt-3 max-w-xs text-sm leading-6 text-white/65">{address}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">Contato</p>
            <a href={`tel:${phone.replace(/\D/g, "")}`} className="mt-3 block text-sm text-white/65 transition hover:text-white">
              {phone}
            </a>
            <a href={`mailto:${email}`} className="mt-1 block break-all text-sm text-white/65 transition hover:text-white">
              {email}
            </a>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">Horários</p>
            <div className="mt-3 space-y-1 text-sm leading-6 text-white/65">
              <p>Segunda a quinta, 11h às 22h</p>
              <p>Sexta e sábado, 11h às 23h</p>
              <p>Domingo, 12h às 21h</p>
            </div>
          </div>

          <nav aria-label="Navegação do rodapé">
            <p className="text-xs uppercase tracking-[0.16em] text-white/35">Navegação</p>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-1">
              <Link to="/menu" className="text-white/65 transition hover:text-white">Início</Link>
              <Link to="/cardapio" className="text-white/65 transition hover:text-white">Cardápio</Link>
              <Link to="/menu#reservations" className="text-white/65 transition hover:text-white">Reservas</Link>
              <Link to="/menu#about" className="text-white/65 transition hover:text-white">Sobre</Link>
            </div>
          </nav>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-xs uppercase tracking-[0.16em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {restaurantName}</p>
          <p>Experiência digital para restaurante</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
