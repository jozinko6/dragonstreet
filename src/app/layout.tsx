import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PwaRegister } from "@/components/dragon/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dragon Street Food Hlohovec | Burgre, kebab, pinsa a donáška",
  description: "Street food klasiky v Hlohovci. Burgre, kebab, pinsa, hot-dogy, wrapy a dezerty s donáškou. Objednaj online!",
  keywords: ["street food Hlohovec", "burger Hlohovec", "kebab Hlohovec", "donáška jedla Hlohovec", "obedové menu Hlohovec", "Dragon Street Food"],
  authors: [{ name: "Dragon Street Food" }],
  icons: {
    icon: "/images/dragon-logo.png",
    apple: "/images/dragon-logo.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Dragon",
    statusBarStyle: "black-translucent",
  },
  openGraph: {
    title: "Dragon Street Food Hlohovec",
    description: "Street food klasiky v Hlohovci. Burgre, kebab, pinsa a dezerty s donáškou. Objednaj online!",
    siteName: "Dragon Street Food",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <PwaRegister />
      </body>
    </html>
  );
}
