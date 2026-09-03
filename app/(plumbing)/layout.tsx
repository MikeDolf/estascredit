import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import LocalBusinessJsonLd from "@/components/seo/LocalBusinessJsonLd";
import OrganizationJsonLd from "@/components/seo/OrganizationJsonLd";
import { business } from "@/lib/business";
import "../globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(business.siteUrl),
  title: {
    default: `${business.name} — ${business.tagline}`,
    template: `%s · ${business.name}`,
  },
  description: business.description,
  openGraph: {
    type: "website",
    siteName: business.name,
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-screen bg-paper text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper focus:shadow-lg"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <LocalBusinessJsonLd />
        <OrganizationJsonLd />
      </body>
    </html>
  );
}
