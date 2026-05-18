import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dragon Street Food Hlohovec | Ázijské jedlo s donáškou",
  description: "Moderné ázijské street food v Hlohovci. Čerstvé rezance, curry, wok jedlá a donáška až k vám. Objednajte online za menej než 60 sekúnd!",
  keywords: ["street food Hlohovec", "donáška jedla Hlohovec", "ázijské jedlo Hlohovec", "obedové menu Hlohovec", "rozvoz jedla Hlohovec", "Dragon Street Food"],
  authors: [{ name: "Dragon Street Food" }],
  icons: {
    icon: "/images/dragon-logo.png",
  },
  openGraph: {
    title: "Dragon Street Food Hlohovec",
    description: "Ázijské street food s donáškou v Hlohovci. Objednajte online!",
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
      </body>
    </html>
  );
}
