import { supabase } from "@/lib/supabase";

export type CustomerTableSession = {
  sessionId: string;
  guestId: string;
  tableNumber: string;
  guestName: string;
  tableToken?: string | null;
};

const STORAGE_KEY = "bella:table-session";
const TOKEN_STORAGE_KEY = "bella:table-token";

export const hasSupabaseConfig = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export function getTableTokenFromUrl() {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get("token");
}

/** QR token from the URL, remembered for the tab so navigating away keeps the table. */
export function getTableToken() {
  if (typeof window === "undefined") return null;
  const fromUrl = getTableTokenFromUrl();
  try {
    if (fromUrl) {
      window.sessionStorage.setItem(TOKEN_STORAGE_KEY, fromUrl);
      return fromUrl;
    }
    return window.sessionStorage.getItem(TOKEN_STORAGE_KEY);
  } catch {
    return fromUrl;
  }
}

export function readCustomerTableSession(): CustomerTableSession | null {
  if (typeof window === "undefined") return null;

  const value = window.localStorage.getItem(STORAGE_KEY);
  if (!value) return null;

  try {
    return JSON.parse(value) as CustomerTableSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function clearCustomerTableSession() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

async function ensureAnonymousSession() {
  const { data } = await supabase.auth.getSession();
  if (data.session?.user?.is_anonymous) return data.session;

  if (data.session && !data.session.user?.is_anonymous) {
    await supabase.auth.signOut();
  }

  const { data: anonymousData, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  if (!anonymousData.session) throw new Error("Não foi possível iniciar a sessão da mesa.");

  return anonymousData.session;
}

export async function ensureCustomerTableSession(
  guestName: string,
): Promise<CustomerTableSession | null> {
  if (!hasSupabaseConfig) return null;

  const tableToken = getTableToken();
  if (!tableToken) {
    throw new Error("Escaneie o QR code da sua mesa para fazer o pedido.");
  }

  await ensureAnonymousSession();

  const stored = readCustomerTableSession();
  if (
    stored &&
    stored.tableToken === tableToken &&
    stored.guestName.toLocaleLowerCase("pt-BR") === guestName.trim().toLocaleLowerCase("pt-BR")
  ) {
    const { data: activeSession } = await supabase
      .from("table_sessions")
      .select("id,status")
      .eq("id", stored.sessionId)
      .maybeSingle();

    if (activeSession && activeSession.status !== "closed") return stored;
    clearCustomerTableSession();
  }

  const { data, error } = await supabase.rpc("join_table_session_by_token", {
    p_table_token: tableToken,
    p_guest_name: guestName.trim(),
  });
  if (error) throw error;

  const joined = Array.isArray(data) ? data[0] : data;
  if (!joined?.session_id || !joined?.guest_id) {
    throw new Error("Não foi possível identificar a sessão atual da mesa.");
  }

  const session: CustomerTableSession = {
    sessionId: joined.session_id,
    guestId: joined.guest_id,
    tableNumber: joined.table_number,
    guestName: guestName.trim(),
    tableToken,
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  return session;
}
