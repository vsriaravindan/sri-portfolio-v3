import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import IntroOverlay from "@/components/IntroOverlay";
import PageTransition from "@/components/PageTransition";
import ScrollToTop from "@/components/ScrollToTop";
import StickyCTA from "@/components/StickyCTA";

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
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://sriaravindan.com",
    siteName: "Sri Aravindan",
    title: "Sri Aravindan — AWS DevOps Engineer",
    description:
      "I build resilient cloud infrastructures, automate complex workflows, and deploy production-grade applications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Aravindan — AWS DevOps Engineer",
    description:
      "Cloud automation, AI-augmented. DevOps engineer specializing in AWS, CI/CD, and production deployments.",
  },
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
          <ScrollToTop />
          <StickyCTA />
          <IntroOverlay />
        </ThemeProvider>
      </body>
    </html>
  );
}
