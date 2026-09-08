import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Brandy AI — Votre directeur créatif, à la demande",
  description:
    "Brandy AI construit l'identité complète de votre marque : audience, positionnement, logo, palette de couleurs et typographies. Un brief, une plateforme de marque.",
  openGraph: {
    title: "Brandy AI — Votre directeur créatif, à la demande",
    description:
      "Audience, positionnement, logo, palette, typographies. Le travail d'une agence, livré en une session.",
    type: "website",
    locale: "fr_FR",
    siteName: "Brandy AI",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=sentient@400,500,700&f[]=switzer@400,500,700,800&f[]=satoshi@400,500,700,900&f[]=zodiak@400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="paper">{children}</body>
    </html>
  );
}
