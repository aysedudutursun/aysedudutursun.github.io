import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "./db.js";

export const COOKIE_ADI = "oturum";

// Çerezdeki token'ı oturumlar tablosunda arar; süresi dolmamışsa yöneticiyi döndürür.
export async function getAdmin() {
  const token = (await cookies()).get(COOKIE_ADI)?.value;
  if (!token) return null;
  const rows = await sql`
    SELECT y.id, y.eposta, o.token FROM oturumlar o
    JOIN yoneticiler y ON y.id = o.yonetici_id
    WHERE o.token = ${token} AND o.bitis > now()`;
  return rows[0] ?? null;
}

// Geçerli oturum yoksa /giris sayfasına yönlendirir.
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/giris");
  return admin;
}
