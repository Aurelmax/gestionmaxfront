import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GestionMax - Formation",
  description: "Plateforme de gestion de formations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
