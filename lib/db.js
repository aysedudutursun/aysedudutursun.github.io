import { neon } from "@neondatabase/serverless";

// Neon veritabanına bağlanır. Adres .env.local içindeki DATABASE_URL'den gelir.
// sql`...` içindeki ${değişken} değerleri parametre olarak gönderilir (SQL injection koruması).
export const sql = neon(process.env.DATABASE_URL);
