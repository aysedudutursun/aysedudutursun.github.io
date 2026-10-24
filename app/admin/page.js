import { sql } from "../../lib/db.js";

export const dynamic = "force-dynamic";

export default async function AdminAnaSayfa() {
  const [m] = await sql`SELECT COUNT(*)::int AS adet FROM iletisim_mesajlari WHERE okundu = false`;
  const [b] = await sql`SELECT COUNT(*)::int AS adet FROM guvenlik_bulgulari`;
  return (
    <section>
      <h2>Özet</h2>
      <p>Okunmamış mesaj sayısı: <strong>{m.adet}</strong></p>
      <p>Toplam güvenlik bulgusu: <strong>{b.adet}</strong></p>
    </section>
  );
}
