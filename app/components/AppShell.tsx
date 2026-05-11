"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    // Admin area uses a focused layout without public storefront chrome.
    return <>{children}</>;
  }

  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pb-24">{children}</main>
      <Footer />
    </CartProvider>
  );
}
