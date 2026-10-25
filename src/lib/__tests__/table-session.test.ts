import { beforeEach, describe, expect, it, vi } from "vitest";

const auth = {
  getSession: vi.fn(),
  signOut: vi.fn(),
  signInAnonymously: vi.fn(),
};
const rpc = vi.fn();
const maybeSingle = vi.fn();

vi.mock("@/lib/supabase", () => ({
  supabase: {
    auth,
    rpc,
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle }) }),
    }),
  },
}));

const STORAGE_KEY = "bella:table-session";
const anonymousSession = { user: { is_anonymous: true } };

async function loadModule() {
  vi.resetModules();
  vi.stubEnv("VITE_SUPABASE_URL", "https://test.supabase.co");
  vi.stubEnv("VITE_SUPABASE_ANON_KEY", "anon");
  return import("@/lib/table-session");
}

function setUrl(search: string) {
  window.history.replaceState({}, "", `/cardapio${search}`);
}

describe("table-session", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setUrl("");
    auth.getSession.mockResolvedValue({ data: { session: anonymousSession } });
    rpc.mockResolvedValue({
      data: [{ session_id: "s1", guest_id: "g1", table_number: "7" }],
      error: null,
    });
  });

  it("reads the QR token from the URL", async () => {
    const { getTableTokenFromUrl } = await loadModule();
    setUrl("?token=tok-1");
    expect(getTableTokenFromUrl()).toBe("tok-1");
  });

  it("discards corrupted stored sessions", async () => {
    const { readCustomerTableSession } = await loadModule();
    window.localStorage.setItem(STORAGE_KEY, "{not json");
    expect(readCustomerTableSession()).toBeNull();
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("joins by QR token and stores the session", async () => {
    const { ensureCustomerTableSession } = await loadModule();
    setUrl("?token=tok-1");

    const session = await ensureCustomerTableSession("", "  Ana ");

    expect(rpc).toHaveBeenCalledWith("join_table_session_by_token", {
      p_table_token: "tok-1",
      p_guest_name: "Ana",
    });
    expect(session).toEqual({
      sessionId: "s1",
      guestId: "g1",
      tableNumber: "7",
      guestName: "Ana",
      tableToken: "tok-1",
    });
    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY)!)).toEqual(session);
  });

  it("signs out a staff session before joining as an anonymous guest", async () => {
    const { ensureCustomerTableSession } = await loadModule();
    auth.getSession.mockResolvedValue({ data: { session: { user: { is_anonymous: false } } } });
    auth.signInAnonymously.mockResolvedValue({ data: { session: anonymousSession }, error: null });
    setUrl("?token=tok-1");

    await ensureCustomerTableSession("", "Ana");

    expect(auth.signOut).toHaveBeenCalled();
    expect(auth.signInAnonymously).toHaveBeenCalled();
  });

  it("reuses a stored session that is still open", async () => {
    const { ensureCustomerTableSession } = await loadModule();
    setUrl("?token=tok-1");
    const stored = { sessionId: "s0", guestId: "g0", tableNumber: "7", guestName: "Ana", tableToken: "tok-1" };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    maybeSingle.mockResolvedValue({ data: { id: "s0", status: "open" } });

    const session = await ensureCustomerTableSession("", "ana");

    expect(session).toEqual(stored);
    expect(rpc).not.toHaveBeenCalled();
  });

  it("starts a new session when the stored one was closed", async () => {
    const { ensureCustomerTableSession } = await loadModule();
    setUrl("?token=tok-1");
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ sessionId: "s0", guestId: "g0", tableNumber: "7", guestName: "Ana", tableToken: "tok-1" }),
    );
    maybeSingle.mockResolvedValue({ data: { id: "s0", status: "closed" } });

    const session = await ensureCustomerTableSession("", "Ana");

    expect(rpc).toHaveBeenCalledOnce();
    expect(session?.sessionId).toBe("s1");
  });

  it("propagates RPC errors", async () => {
    const { ensureCustomerTableSession } = await loadModule();
    setUrl("?token=bad");
    rpc.mockResolvedValue({ data: null, error: new Error("Invalid or inactive table QR token") });

    await expect(ensureCustomerTableSession("", "Ana")).rejects.toThrow("Invalid or inactive");
  });
});
