import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "Ibersoft Portal IT",
  description: "Portal profesional de Ibersoft para gestion de partes tecnicos, productividad y supervision empresarial."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={manrope.variable}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
