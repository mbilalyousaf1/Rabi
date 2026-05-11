import type { Metadata } from "next";
import { Poppins, Playfair_Display, ZCOOL_XiaoWei } from "next/font/google";
import "./globals.css";
import AppShell from "./components/AppShell";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const zcool = ZCOOL_XiaoWei({
  variable: "--font-chinese",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Rabi Chinese Restaurant - Authentic Chinese Cuisine",
  description:
    "Experience authentic Chinese cuisine with handcrafted dishes prepared fresh daily. Premium dining with traditional flavors and modern ambiance.",
  keywords:
    "Chinese restaurant, authentic cuisine, dim sum, noodles, reservations",
  openGraph: {
    title: "Rabi Chinese Restaurant",
    description: "Authentic Chinese Cuisine & Premium Dining",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#8B0000" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${poppins.variable} ${playfair.variable} ${zcool.variable} antialiased`}
        suppressHydrationWarning
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
