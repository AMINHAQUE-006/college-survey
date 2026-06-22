"use client";

import { Icon } from "@/constant";
import { api } from "@/lib/client-api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setLoading(true); setError("");
    try {
      await api("/api/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
      router.push(search.get("callbackUrl") || "/admin"); router.refresh();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };
  return <div className="public-page"><main className="success"><div className="success-mark"><Icon name="shield" size={34}/></div><p className="eyebrow">ADMIN PORTAL</p><h1>Sign in</h1><form className="start-card" onSubmit={submit}>{error&&<p className="error">{error}</p>}<label>Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" required minLength="8" value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="primary full" disabled={loading}>{loading?"Signing in…":"Sign in"}</button></form></main></div>;
}
export default function LoginPage(){return <Suspense><LoginForm/></Suspense>}
