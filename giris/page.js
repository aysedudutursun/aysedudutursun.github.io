"use client";

import { useActionState } from "react";
import { girisYap } from "./actions.js";

const kutu = {
  maxWidth: 380, margin: "12vh auto", padding: 28, borderRadius: 14,
  background: "#0e1424", color: "#e6ecff", border: "1px solid #25304d",
  fontFamily: "system-ui, sans-serif", position: "relative", zIndex: 5,
};
const girdi = {
  width: "100%", padding: "10px 12px", margin: "6px 0 14px", borderRadius: 8,
  border: "1px solid #33415f", background: "#070a14", color: "#e6ecff", boxSizing: "border-box",
};

export default function GirisSayfasi() {
  const [durum, eylem, bekliyor] = useActionState(girisYap, null);
  return (
    <main style={kutu}>
      <h1 style={{ marginTop: 0 }}>Yönetici girişi</h1>
      <form action={eylem}>
        <label>E-posta
          <input style={girdi} type="email" name="eposta" required maxLength={200} autoComplete="username" />
        </label>
        <label>Şifre
          <input style={girdi} type="password" name="sifre" required maxLength={200} autoComplete="current-password" />
        </label>
        {durum?.hata && <p role="alert" style={{ color: "#ff6b6b" }}>{durum.hata}</p>}
        <button disabled={bekliyor} style={{ ...girdi, cursor: "pointer", background: "#00f0ff", color: "#070a14", fontWeight: 700, margin: 0 }}>
          {bekliyor ? "Kontrol ediliyor..." : "Giriş yap"}
        </button>
      </form>
    </main>
  );
}
