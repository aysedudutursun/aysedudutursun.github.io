import "./globals.css";

export const metadata = {
  title: "Ayşe Dudu Tursun",
  description:
    "Ayşe Dudu Tursun — Büyük Veri Analistliği öğrencisi. Veri analizi, makine öğrenmesi ve büyük veri projeleri.",
  openGraph: {
    type: "website",
    title: "Ayşe Dudu Tursun",
    description: "Büyük Veri Analistliği öğrencisi · Portfolyo",
    images: ["https://aysedudutursun.github.io/assets/img/profil.jpg"],
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%23070a14'/%3E%3Ctext x='32' y='43' font-size='30' font-family='Arial' font-weight='700' fill='%2300f0ff' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#070a14",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme:light)").matches?"light":"dark";document.documentElement.setAttribute("data-theme",t)}catch(e){document.documentElement.setAttribute("data-theme","dark")}`,
          }}
        />
        <link rel="preload" as="image" href="/assets/img/profil.jpg" />
      </head>
      <body>{children}</body>
    </html>
  );
}