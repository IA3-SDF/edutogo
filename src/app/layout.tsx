import React from "react";
import { AppProvider } from "./providers";
import { HeaderFooterWrapper } from "./HeaderFooterWrapper";
import "./globals.css";

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
    <html lang="fr" className="light" style={{ colorScheme: "light dark" }}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css"
        />
      </head>
      <body className="antialiased m-0 p-0">
        <AppProvider>
          <HeaderFooterWrapper>{children}</HeaderFooterWrapper>
        </AppProvider>
      </body>
    </html>
  );
}
