import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["200", "400", "500", "700", "800"],
  variable: "--font-tajawal",
});

export const metadata: Metadata = {
  title: "ABCE",
  description: "protfolio",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${tajawal.className} antialiased bg-slate-950 text-slate-50`}
      >
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
