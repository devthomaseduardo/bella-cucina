import React, { useEffect, useState } from "react";
import { ChefHat } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";

interface LoginProps {
  onLogin: () => void;
  title?: string;
  description?: string;
}

const isStaffSession = (session: Session | null) => {
  if (!session) return false;
  return session.user?.is_anonymous !== true;
};

const WaiterLogin = ({
  onLogin,
  title = "Acesso restrito",
  description = "Faça login com uma conta da equipe para continuar.",
}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isStaffSession(session)) onLogin();
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isStaffSession(session)) onLogin();
    });

    return () => subscription.unsubscribe();
  }, [onLogin]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data: current } = await supabase.auth.getSession();
      if (current.session?.user?.is_anonymous) {
        await supabase.auth.signOut();
      }

      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) throw loginError;
      if (!isStaffSession(data.session)) throw new Error("Conta sem acesso de equipe");
      onLogin();
    } catch {
      setError("Credenciais inválidas ou conta sem acesso à equipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border/60 bg-card p-7 shadow-sm sm:p-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <ChefHat className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">{title}</h2>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default WaiterLogin;
