import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import MenuCategoryFilter from "./MenuCategoryFilter";
import MenuItem from "./MenuItem";
import { useI18n } from "@/i18n/I18nProvider";
import { ITALIAN_MENU_ITEMS } from "@/data/italian-menu";
import type { MenuCategoryId, MenuItemRecord } from "@/types/menu-item";
import { supabase } from "@/lib/supabase";

type MenuItemType = MenuItemRecord;

interface MenuSectionProps {
  items?: MenuItemType[];
  title?: string;
  description?: string;
  showQrCode?: boolean;
}

const MenuSection = ({
  items = ITALIAN_MENU_ITEMS,
  title,
  description,
  showQrCode = true,
}: MenuSectionProps) => {
  const { t } = useI18n();
  const shouldReduceMotion = useReducedMotion();
  const resolvedTitle = title ?? t("menu.sectionTitle");
  const resolvedDescription = description ?? t("menu.sectionDescription");

  const [activeCategory, setActiveCategory] = React.useState("all");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [dbItems, setDbItems] = React.useState<MenuItemType[]>(items);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let active = true;

    async function loadMenu() {
      const hasSupabaseConfig = Boolean(
        import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
      );

      if (!hasSupabaseConfig) {
        if (active) {
          setDbItems(items);
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from("menu_items")
          .select("*, menu_categories(slug)")
          .eq("available", true)
          .order("order", { ascending: true });

        if (error) throw error;
        if (!active) return;

        if (data?.length) {
          setDbItems(
            data.map((row) => ({
              // The slug is shared with the static data (details, allergens) and place_order.
              id: row.slug ?? row.id,
              name: row.name_pt || row.name_en,
              description: row.description_pt || row.description_en || "",
              price: Number(row.price),
              image:
                row.image_url ||
                "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
              category: (row.menu_categories?.slug || "specials") as MenuCategoryId,
              featured: Boolean(row.popular),
            })),
          );
        } else {
          setDbItems(items);
        }
      } catch (error) {
        console.error("Falha ao carregar o cardápio", error);
        if (active) setDbItems(items);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadMenu();

    return () => {
      active = false;
    };
  }, [items]);

  const filteredItems = React.useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLocaleLowerCase("pt-BR");

    return dbItems.filter((item) => {
      const matchesCategory =
        activeCategory === "all" ||
        item.category.toLowerCase() === activeCategory.toLowerCase();

      if (!matchesCategory) return false;
      if (!normalizedSearch) return true;

      return `${item.name} ${item.description}`
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedSearch);
    });
  }, [activeCategory, searchQuery, dbItems]);

  const featuredItems = React.useMemo(
    () => dbItems.filter((item) => item.featured).slice(0, 3),
    [dbItems],
  );

  return (
    <div className="relative w-full min-w-0 overflow-hidden bg-background pb-20 pt-8 sm:pb-24 md:pt-12 lg:pb-28">
      <div className="container relative mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          className="grid gap-7 border-b border-white/10 pb-8 md:pb-10 lg:grid-cols-[1fr_auto] lg:items-end"
        >
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary sm:text-xs">
              Cardápio digital
            </p>
            <h2 className="mt-3 max-w-[12ch] font-display text-4xl leading-[0.96] text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
              {resolvedTitle}
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              {resolvedDescription}
            </p>
          </div>

          {showQrCode && (
            <div className="hidden items-center gap-4 lg:flex">
              <div className="bg-white p-2">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=92x92&data=https://bella-cucina-demo.vercel.app/cardapio"
                  alt={t("menu.qrTitle")}
                  className="h-[72px] w-[72px]"
                />
              </div>
              <div className="max-w-[13rem]">
                <p className="text-sm font-semibold text-foreground">{t("menu.qrTitle")}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{t("menu.qrDescription")}</p>
              </div>
            </div>
          )}
        </motion.header>

        {featuredItems.length > 0 && (
          <section className="py-8 sm:py-10">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Seleção da casa</p>
                <h3 className="mt-2 font-display text-2xl text-foreground sm:text-3xl">Comece por aqui.</h3>
              </div>
              <span className="hidden text-xs uppercase tracking-[0.16em] text-muted-foreground sm:block">
                {featuredItems.length} sugestões
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {featuredItems.map((item) => (
                <MenuItem
                  key={`featured-${item.id}`}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                  category={item.category}
                  className="h-full"
                />
              ))}
            </div>
          </section>
        )}

        <div className="sticky top-[3.8rem] z-30 -mx-4 border-y border-white/10 bg-background/94 px-4 py-3 backdrop-blur-xl sm:mx-0 sm:top-[4.2rem] sm:px-0 md:top-[4.6rem]">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
              <Input
                placeholder={t("menu.searchPlaceholder")}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 rounded-full border-white/10 bg-muted/20 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/60"
              />
            </div>

            <div className="min-w-0 flex-1 lg:flex lg:justify-end">
              <MenuCategoryFilter
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
              />
            </div>
          </div>
        </div>

        <div className="mb-5 mt-7 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden />
            <span>{activeCategory === "all" ? "Todos os pratos" : t(`menu.category.${activeCategory}`)}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {loading ? "Carregando" : `${filteredItems.length} ${filteredItems.length === 1 ? "item" : "itens"}`}
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Carregando cardápio">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="min-h-[26rem] animate-pulse bg-muted/20" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredItems.map((item) => (
              <MenuItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={item.image}
                category={item.category}
                className="h-full"
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="font-display text-3xl text-foreground">Nenhum prato encontrado.</p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
              Tente outro termo ou selecione uma categoria diferente.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuSection;
