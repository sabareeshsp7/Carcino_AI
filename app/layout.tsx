import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { MedicalHistoryProvider } from "@/contexts/MedicalHistoryContext";
import { WishlistProvider } from "@/components/shop/wishlist-context";
import { CartProvider } from "@/contexts/cart-context";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carcino AI",
  description: "AI-powered dermatology analysis and medical management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MedicalHistoryProvider>
          <WishlistProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </WishlistProvider>
        </MedicalHistoryProvider>
      </body>
    </html>
  );
}
