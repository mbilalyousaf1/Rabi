"use client";

import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CartProvider } from "../context/CartContext";
import CartDrawer from "./CartDrawer";

type AppShellProps = {
  children: ReactNode;
};

export default function AppShell({ children }: AppShellProps) {
  return (
    <CartProvider>
      <Navbar />
      <CartDrawer />
      <main className="min-h-screen pb-24">{children}</main>
      <Footer />
    </CartProvider>
  );
}
