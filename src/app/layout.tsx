import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FocusProvider } from "@/context/FocusContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tokamak Network",
  description: "Tailored Ethereum Solution",
  icons: {
    icon: [
      {
        url: "/tokamak_favicon.ico",
        type: "image/x-icon",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <link rel="stylesheet" href="https://use.typekit.net/fuc6kbq.css" />
      </head>
      <body
        className="font-display antialiased bg-background-light text-slate-900"
        suppressHydrationWarning
      >
        <FocusProvider>{children}</FocusProvider>
      </body>
    </html>
  );
}
