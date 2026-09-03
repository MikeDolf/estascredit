import type { Metadata, Viewport } from "next";
import { Manrope, Inter } from "next/font/google";
import UfHeader from "@/components/uf/UfHeader";
import UfFooter from "@/components/uf/UfFooter";
import { uralforklift as uf } from "@/lib/uralforklift";
import "../globals.css";

const display = Manrope({
  subsets: ["cyrillic", "latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sans = Inter({
  subsets: ["cyrillic", "latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(uf.siteUrl),
  title: {
    default: `${uf.name} — ${uf.tagline}`,
    template: `%s · ${uf.name}`,
  },
  description: uf.description,
  openGraph: { type: "website", siteName: uf.name, locale: uf.locale },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: "/uf/favicon.png",
    apple: "/uf/apple-touch-icon.png",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function UralforkliftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper focus:shadow-lg"
        >
          Перейти к содержимому
        </a>
        <UfHeader />
        <main id="main">{children}</main>
        <UfFooter />
      </body>
    </html>
  );
}
