"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sql } from "../../lib/db.js";
import { COOKIE_ADI } from "../../lib/auth.js";

// Oturumu veritabanından siler ve çerezi temizler
export async function cikisYap() {
  const jar = await cookies();
  const token = jar.get(COOKIE_ADI)?.value;
  if (token) await sql`DELETE FROM oturumlar WHERE token = ${token}`;
  jar.delete(COOKIE_ADI);
  redirect("/giris");
}
