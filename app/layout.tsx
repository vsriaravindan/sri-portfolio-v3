import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import IntroOverlay from "@/components/IntroOverlay";
import PageTransition from "@/components/PageTransition";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Sri Aravindan — AWS DevOps Engineer",
  description:
    "DevOps engineer specializing in AWS cloud infrastructure, CI/CD automation, and AI-augmented development.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <Header />
          <PageTransition>
            <main>{children}</main>
          </PageTransition>
          <Footer />
          <CommandPalette />
          <IntroOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
