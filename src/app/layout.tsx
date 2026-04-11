import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans"
});

export const metadata: Metadata = {
  title: "WorkingParts",
  description: "Plataforma operativa para tickets, clientes, actividad tecnica y seguimiento empresarial.",
  applicationName: "WorkingParts",
  keywords: ["workingparts", "tickets", "operaciones", "soporte IT", "clientes", "reporting"],
  openGraph: {
    title: "WorkingParts",
    description: "Plataforma operativa para tickets, clientes, actividad tecnica y seguimiento empresarial.",
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
