import React, { Suspense } from "react";
import { HeaderFooterWrapper } from "../components/student/HeaderFooterWrapper";
import "./globals.css";
import { AppProvider } from "./providers";

export const metadata = {
  title: "EduTogo",
  description:
    "Plateforme éducative togolaise pour la préparation et la réussite du Baccalauréat.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" suppressHydrationWarning className="light" style={{ colorScheme: "light dark" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        />
        <link rel="icon" href="/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icon-192x192.svg" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="EduTOGO" />
      </head>
      <body className="antialiased m-0 p-0">
        <AppProvider>
          <Suspense fallback={<div className="min-h-screen">Chargement...</div>}>
            <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
          </Suspense>
        </AppProvider>
      </body>
    </html>
  );
}
