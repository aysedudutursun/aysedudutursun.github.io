"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { sql } from "../../lib/db.js";
import { COOKIE_ADI } from "../../lib/auth.js";

const HATA = "E-posta veya şifre hatalı";

export async function girisYap(_onceki, formData) {
  const eposta = String(formData.get("eposta") ?? "").trim().toLowerCase();
  const sifre = String(formData.get("sifre") ?? "");

  // Sunucu tarafında boş / çok uzun girişleri reddet
  if (!eposta || !sifre || eposta.length > 200 || sifre.length > 200) {
    return { hata: HATA };
  }

  const rows = await sql`SELECT id, sifre_hash FROM yoneticiler WHERE eposta = ${eposta}`;
  const yonetici = rows[0];
  const dogru = yonetici ? await bcrypt.compare(sifre, yonetici.sifre_hash) : false;
  if (!dogru) return { hata: HATA }; // hangisinin yanlış olduğunu söyleme

  // Rastgele token üret, 2 saat geçerli olacak şekilde kaydet
  const token = crypto.randomBytes(32).toString("hex");
  await sql`
    INSERT INTO oturumlar (token, yonetici_id, bitis)
    VALUES (${token}, ${yonetici.id}, now() + interval '2 hours')`;

  (await cookies()).set(COOKIE_ADI, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
  redirect("/admin");
}
