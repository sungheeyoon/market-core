import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Market Core | Premium Shopping Experience",
    template: "%s | Market Core"
  },
  description: "Experience the next generation of e-commerce with Market Core. High-quality products, seamless checkout, and premium design.",
  keywords: ["e-commerce", "shopping", "premium", "market core", "nextjs"],
  authors: [{ name: "Market Core Team" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://market-core.vercel.app",
    title: "Market Core | Premium Shopping Experience",
    description: "Curated collection of premium products for your lifestyle.",
    siteName: "Market Core",
  },
  twitter: {
    card: "summary_large_image",
    title: "Market Core | Premium Shopping Experience",
    description: "Curated collection of premium products for your lifestyle.",
  },
};

import { CartProvider } from '@/presentation/context/CartContext';
import { AuthProvider } from '@/presentation/context/AuthContext';
import { Header } from '@/presentation/components/Header';
import { Suspense } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <CartProvider>
          <AuthProvider>
            <Suspense fallback={<div className="h-20 bg-white" />}>
              <Header />
            </Suspense>
            {children}
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}
