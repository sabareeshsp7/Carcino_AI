import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CartProvider } from "@/contexts/cart-context";
import { ThemeProvider } from "next-themes";
import { PageLoader } from "@/components/ui/page-loader";
import { MedicalHistoryProvider } from "@/contexts/MedicalHistoryContext";
import "leaflet/dist/leaflet.css";
import "./globals.css";

// Font configuration
const inter = Inter({ subsets: ["latin"] });

// Next.js metadata export for SEO and title
export const metadata = {
  title: "Carcino AI",
  description: "Carcinoma Cells Prediction and Skin Cancer Management Platform",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
          integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
          crossOrigin=""
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <CartProvider>
            <MedicalHistoryProvider>
              <PageLoader />
              {children}
              <Toaster />
              <SpeedInsights />
            </MedicalHistoryProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
