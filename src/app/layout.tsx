import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "WorkingParts | Ibersoft Portal IT",
  description: "Portal profesional para tickets, partes tecnicos, clientes, supervision y facturacion ligera de Ibersoft.",
  applicationName: "WorkingParts",
  keywords: ["workingparts", "ibersoft", "tickets", "partes tecnicos", "soporte IT", "facturacion"],
  openGraph: {
    title: "WorkingParts",
    description: "Portal premium para servicio tecnico, clientes y partes de trabajo.",
    type: "website"
  }
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
