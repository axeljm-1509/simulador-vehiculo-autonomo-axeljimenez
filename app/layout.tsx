import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Decisiones bajo incertidumbre",
  description:
    "Prototipo académico para explicar decisiones seguras cuando los sensores de un vehículo se contradicen.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
