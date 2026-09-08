import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  title: "Cally Leads",
  description:
    "Cally Leads qualifie vos prospects entrants et vous rend les rendez-vous qui valent le déplacement.",
  openGraph: {
    title: "Cally Leads",
    description:
      "Qualifiez vos prospects entrants. Ne gardez que les rendez-vous qui valent le déplacement.",
    type: "website",
    locale: "fr_FR",
    siteName: "Cally Leads",
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
          href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600,700&f[]=clash-display@500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="paper">{children}</body>
    </html>
  );
}
