import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "'@mantine/core/styles.css'";
import { MantineProvider, ColorSchemeScript } from '@mantine/core';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "oficina-solution-saas",
  description: "Gestão de Marcenaria",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        {/* Envolva o children com o MantineProvider */}
        <MantineProvider>{children}</MantineProvider>
      </body>
    </html>
  );
}