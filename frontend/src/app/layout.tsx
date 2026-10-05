import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SAGZFX ACADEMY — Profits Forever",
    template: "%s | SAGZFX ACADEMY",
  },
  description:
    "Learn, Trade, Grow. SAGZFX ACADEMY — Nigeria's premier forex trading school. Master market structure, SMC, and institutional order flow.",
  keywords: [
    "forex",
    "trading academy",
    "SAGZFX",
    "Nigeria",
    "Abuja",
    "smart money concepts",
    "SMC",
    "MT5",
  ],
  authors: [{ name: "SAGZFX ACADEMY" }],
  openGraph: {
    title: "SAGZFX ACADEMY — Profits Forever",
    description: "Learn, Trade, Grow. Nigeria's premier forex trading school.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
