import { requireAdmin } from "../../lib/auth.js";
import { cikisYap } from "./actions.js";

export const dynamic = "force-dynamic";

// /admin altındaki her sayfa bu yerleşimden geçer; geçerli oturum yoksa /giris'e yönlendirilir.
export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 24, borderRadius: 14, background: "#0e1424", color: "#e6ecff", fontFamily: "system-ui, sans-serif", position: "relative", zIndex: 5 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <strong>Yönetim paneli · {admin.eposta}</strong>
        <form action={cikisYap}><button style={{ padding: "8px 14px", borderRadius: 8, cursor: "pointer" }}>Çıkış</button></form>
      </header>
      <hr style={{ borderColor: "#25304d", margin: "16px 0" }} />
      {children}
    </div>
  );
}
